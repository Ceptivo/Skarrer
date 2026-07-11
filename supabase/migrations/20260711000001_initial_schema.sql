-- Skarrel initial schema
-- Foundation tables per Master Document §7-8: users (profiles), retailers,
-- branches, categories, products, deals, deal accuracy checks, baskets,
-- and savings history. Later chunks add: subscriptions/payments (PayFast),
-- referrals, badges, favourites, price history, notifications.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type public.suburb as enum ('westville', 'pinetown', 'upper_highway');
create type public.deal_source as enum ('manual', 'scraped');
create type public.deal_status as enum ('active', 'expired', 'removed');
create type public.plan_tier as enum ('free', 'premium');

-- ---------------------------------------------------------------------------
-- Helper: updated_at maintenance
-- ---------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles (one row per auth user)
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null,
  full_name text,
  home_suburb public.suburb,
  language text not null default 'en' check (language in ('en', 'zu', 'af')),
  plan public.plan_tier not null default 'free',
  is_admin boolean not null default false,
  -- Leaderboard is opt-in and OFF by default (Master Doc §7 / ToS §7a).
  leaderboard_opt_in boolean not null default false,
  leaderboard_show_full_name boolean not null default false,
  -- Required before referral rewards qualify (Master Doc §5).
  phone_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile when a user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nickname)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'nickname',
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'skarreler'
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Admin check used by RLS policies below. SECURITY DEFINER so it can read
-- profiles regardless of the caller's own RLS visibility.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ---------------------------------------------------------------------------
-- Retailers & branches
-- ---------------------------------------------------------------------------

create table public.retailers (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  -- true once this retailer's automated scraper is feeding data
  -- (drives the "Live" badge; manual entry until then — Master Doc §8).
  is_live boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  retailer_id uuid not null references public.retailers (id) on delete cascade,
  name text not null,
  suburb public.suburb not null,
  address text,
  -- Coordinates power the fuel cost estimate later (Master Doc §8:
  -- "branches table with address/coordinates per retailer").
  latitude double precision,
  longitude double precision,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (retailer_id, name)
);

create index branches_retailer_idx on public.branches (retailer_id);
create index branches_suburb_idx on public.branches (suburb);

-- ---------------------------------------------------------------------------
-- Categories & products
-- ---------------------------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  sort_order integer not null default 0
);

-- Canonical product list. Launch matching is name-based (no barcodes —
-- Master Doc §3 technical note); this table gives basket comparison,
-- the public Basket Index, and favourites a stable product identity.
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  normalized_name text generated always as (
    lower(regexp_replace(name, '\s+', ' ', 'g'))
  ) stored,
  category_id uuid references public.categories (id) on delete set null,
  size_label text,
  created_at timestamptz not null default now(),
  unique (normalized_name)
);

-- ---------------------------------------------------------------------------
-- Deals
-- ---------------------------------------------------------------------------

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  retailer_id uuid not null references public.retailers (id) on delete cascade,
  -- null branch_id = applies to all of this retailer's branches in the
  -- coverage area; set it when a special is branch-specific.
  branch_id uuid references public.branches (id) on delete set null,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  category_id uuid references public.categories (id) on delete set null,
  price numeric(10, 2) not null check (price >= 0),
  original_price numeric(10, 2) check (original_price >= 0),
  image_url text,
  source public.deal_source not null default 'manual',
  status public.deal_status not null default 'active',
  -- Paid "Sponsored" badge — always distinct from the usage-driven HOT
  -- badge, which is computed from favourites/basket adds, never stored
  -- or sold (Master Doc §4).
  is_sponsored boolean not null default false,
  starts_at date not null default current_date,
  expires_at date not null,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (expires_at >= starts_at)
);

create index deals_feed_idx on public.deals (status, expires_at desc);
create index deals_retailer_idx on public.deals (retailer_id);
create index deals_category_idx on public.deals (category_id);
create index deals_product_idx on public.deals (product_id);

create trigger deals_set_updated_at
  before update on public.deals
  for each row execute function public.set_updated_at();

-- Crowd accuracy check: "Still accurate?" taps (Master Doc §3).
create table public.deal_checks (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references public.deals (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  is_accurate boolean not null,
  created_at timestamptz not null default now(),
  unique (deal_id, user_id)
);

create index deal_checks_deal_idx on public.deal_checks (deal_id);

-- ---------------------------------------------------------------------------
-- Baskets
-- ---------------------------------------------------------------------------

-- One user can have several baskets (multi-list management is launch scope).
create table public.baskets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default 'My Basket',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index baskets_user_idx on public.baskets (user_id);

create trigger baskets_set_updated_at
  before update on public.baskets
  for each row execute function public.set_updated_at();

create table public.basket_items (
  id uuid primary key default gen_random_uuid(),
  basket_id uuid not null references public.baskets (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  product_name text not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now()
);

create index basket_items_basket_idx on public.basket_items (basket_id);

-- ---------------------------------------------------------------------------
-- Savings history
-- ---------------------------------------------------------------------------

-- One row per completed basket comparison. Savings are measured against the
-- AVERAGE total across stores checked, not the most expensive (Master Doc §7).
create table public.savings_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  basket_id uuid references public.baskets (id) on delete set null,
  cheapest_retailer_id uuid references public.retailers (id) on delete set null,
  cheapest_total numeric(10, 2) not null check (cheapest_total >= 0),
  average_total numeric(10, 2) not null check (average_total >= 0),
  amount_saved numeric(10, 2) generated always as (average_total - cheapest_total) stored,
  stores_compared integer not null check (stores_compared >= 2),
  occurred_at timestamptz not null default now()
);

create index savings_events_user_idx on public.savings_events (user_id, occurred_at desc);

-- Monthly rollup for the Savings screen bar chart. security_invoker so the
-- caller's RLS applies (each user only sees their own rows).
create view public.monthly_savings
with (security_invoker = true) as
select
  user_id,
  date_trunc('month', occurred_at) as month,
  sum(amount_saved) as total_saved,
  count(*) as comparisons
from public.savings_events
group by user_id, date_trunc('month', occurred_at);

-- Aggregate accuracy stats without exposing individual voters.
-- Deliberately NOT security_invoker: runs as owner so it can aggregate
-- across all users' checks while deal_checks stays own-rows-only.
create view public.deal_accuracy as
select
  deal_id,
  count(*) as checks_count,
  round(100.0 * count(*) filter (where is_accurate) / count(*), 0) as accurate_pct
from public.deal_checks
group by deal_id;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- Account required from signup — no anonymous browsing in v1 (Master Doc §9),
-- so catalogue reads are granted to authenticated users only.

alter table public.profiles enable row level security;
alter table public.retailers enable row level security;
alter table public.branches enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.deals enable row level security;
alter table public.deal_checks enable row level security;
alter table public.baskets enable row level security;
alter table public.basket_items enable row level security;
alter table public.savings_events enable row level security;

-- Profiles: users see and edit their own row. Column-level grants stop a
-- user from promoting themselves (is_admin/plan/phone_verified are managed
-- server-side only).
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = (select auth.uid()));

create policy "profiles: update own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

revoke update on public.profiles from authenticated;
grant update (nickname, full_name, home_suburb, language,
              leaderboard_opt_in, leaderboard_show_full_name)
  on public.profiles to authenticated;

-- Catalogue tables: readable by any signed-in user, writable by admin only.
create policy "retailers: read" on public.retailers
  for select to authenticated using (true);
create policy "retailers: admin write" on public.retailers
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "branches: read" on public.branches
  for select to authenticated using (true);
create policy "branches: admin write" on public.branches
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "categories: read" on public.categories
  for select to authenticated using (true);
create policy "categories: admin write" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "products: read" on public.products
  for select to authenticated using (true);
create policy "products: admin write" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "deals: read" on public.deals
  for select to authenticated using (true);
create policy "deals: admin write" on public.deals
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Deal checks: one vote per user per deal; users only see their own vote
-- (aggregates come from the deal_accuracy view).
create policy "deal_checks: read own" on public.deal_checks
  for select to authenticated using (user_id = (select auth.uid()));
create policy "deal_checks: insert own" on public.deal_checks
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "deal_checks: update own" on public.deal_checks
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Baskets & items: fully private to their owner.
create policy "baskets: own" on public.baskets
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "basket_items: own" on public.basket_items
  for all to authenticated
  using (
    exists (
      select 1 from public.baskets b
      where b.id = basket_id and b.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.baskets b
      where b.id = basket_id and b.user_id = (select auth.uid())
    )
  );

-- Savings history: private to the owner. (The opt-in leaderboard will be
-- served by a dedicated view/function in a later chunk, honouring
-- leaderboard_opt_in — never by opening these rows up.)
create policy "savings_events: read own" on public.savings_events
  for select to authenticated using (user_id = (select auth.uid()));
create policy "savings_events: insert own" on public.savings_events
  for insert to authenticated with check (user_id = (select auth.uid()));
