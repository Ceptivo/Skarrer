-- Engagement: favourites (hearts) and the usage signals behind the HOT
-- badge (Master Doc §3, §4 — HOT is most-saved/most-added, purely
-- usage-driven, never for sale). Crowd accuracy uses the deal_checks
-- table and deal_accuracy view from migration 0001.

create table public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create index favorites_product_idx on public.favorites (product_id);

alter table public.favorites enable row level security;

create policy "favorites: own" on public.favorites
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Aggregate popularity per product (favourites + basket adds), across all
-- users. Deliberately NOT security_invoker: runs as owner so it can count
-- over rows the caller can't see; exposes only counts, no user identities.
create view public.product_popularity as
select
  p.id as product_id,
  coalesce(f.cnt, 0) as favorites_count,
  coalesce(b.cnt, 0) as basket_count,
  coalesce(f.cnt, 0) + coalesce(b.cnt, 0) as popularity
from public.products p
left join (
  select product_id, count(*) as cnt from public.favorites group by product_id
) f on f.product_id = p.id
left join (
  select product_id, count(*) as cnt
  from public.basket_items
  where product_id is not null
  group by product_id
) b on b.product_id = p.id;
