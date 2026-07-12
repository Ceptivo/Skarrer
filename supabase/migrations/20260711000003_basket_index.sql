-- "Cheapest Basket This Week" — the standardised public basket index
-- (Master Doc §3, §7). A fixed list of staple products tracked across all
-- five retailers; drives the in-app weekly table and the shareable graphic.
-- Idempotent; safe for production.

create table public.index_products (
  product_id uuid primary key references public.products (id) on delete cascade,
  sort_order integer not null default 0
);

alter table public.index_products enable row level security;

create policy "index_products: read" on public.index_products
  for select to authenticated using (true);
create policy "index_products: admin write" on public.index_products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- The staples from the locked graphic design. Creating the products here
-- also means the admin deal form's autocomplete offers these exact names,
-- keeping deal -> index matching reliable.
insert into public.products (name)
values
  ('Full Cream Milk 1L'),
  ('White Bread 700g'),
  ('Rice 2kg'),
  ('Maize Meal 5kg'),
  ('White Sugar 2kg'),
  ('Free Range Eggs 18s'),
  ('Beef Mince 500g')
on conflict (normalized_name) do nothing;

insert into public.index_products (product_id, sort_order)
select p.id, x.sort_order
from (values
  ('full cream milk 1l', 1),
  ('white bread 700g', 2),
  ('rice 2kg', 3),
  ('maize meal 5kg', 4),
  ('white sugar 2kg', 5),
  ('free range eggs 18s', 6),
  ('beef mince 500g', 7)
) as x (normalized_name, sort_order)
join public.products p on p.normalized_name = x.normalized_name
on conflict (product_id) do nothing;
