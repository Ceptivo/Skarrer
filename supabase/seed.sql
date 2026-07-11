-- Development seed data. Runs automatically on `supabase db reset` (local only).
-- Do NOT run against production: branch names below are placeholders from the
-- mockup — the real Westville/Pinetown/Upper Highway branch list is still an
-- open item in the Master Document (§8) and must be enumerated and verified.

insert into public.retailers (name, slug) values
  ('Superspar', 'superspar'),
  ('Woolworths', 'woolworths'),
  ('Checkers', 'checkers'),
  ('Pick n Pay', 'pick-n-pay'),
  ('OK Foods', 'ok-foods');

insert into public.categories (name, slug, sort_order) values
  ('Dairy', 'dairy', 1),
  ('Bakery', 'bakery', 2),
  ('Meat', 'meat', 3),
  ('Pantry', 'pantry', 4),
  ('Produce', 'produce', 5);

-- Placeholder branches (from the mockup — verify before launch).
insert into public.branches (retailer_id, name, suburb, address)
select r.id, b.name, b.suburb::public.suburb, b.address
from (values
  ('checkers',   'Westville Pavilion', 'westville', 'The Pavilion, Jack Martens Dr, Westville'),
  ('pick-n-pay', 'Jan Hofmeyr Rd',     'westville', 'Jan Hofmeyr Rd, Westville'),
  ('superspar',  'Westway Mall',       'westville', 'Westway Mall, The Boulevard, Westville'),
  ('woolworths', 'Pavilion',           'westville', 'The Pavilion, Jack Martens Dr, Westville'),
  ('ok-foods',   'Pinetown',           'pinetown',  'Hill St, Pinetown')
) as b (retailer_slug, name, suburb, address)
join public.retailers r on r.slug = b.retailer_slug;

-- Sample products + deals so the feed has something to render in dev.
insert into public.products (name, category_id, size_label)
select p.name, c.id, p.size_label
from (values
  ('Full Cream Milk 1L',   'dairy',  '1L'),
  ('White Bread 700g',     'bakery', '700g'),
  ('Beef Mince 500g',      'meat',   '500g'),
  ('Free Range Eggs 18s',  'dairy',  '18s')
) as p (name, category_slug, size_label)
join public.categories c on c.slug = p.category_slug;

insert into public.deals
  (retailer_id, branch_id, product_id, product_name, category_id, price, original_price, expires_at)
select
  r.id,
  br.id,
  pr.id,
  pr.name,
  pr.category_id,
  d.price,
  d.original_price,
  current_date + d.days_left
from (values
  ('checkers',   'Westville Pavilion', 'Full Cream Milk 1L',  18.99, 24.99, 3),
  ('pick-n-pay', 'Jan Hofmeyr Rd',     'White Bread 700g',    14.49, 19.99, 5),
  ('superspar',  'Westway Mall',       'Beef Mince 500g',     54.99, 69.99, 2),
  ('woolworths', 'Pavilion',           'Free Range Eggs 18s', 42.99, 49.99, 6)
) as d (retailer_slug, branch_name, product_name, price, original_price, days_left)
join public.retailers r on r.slug = d.retailer_slug
join public.branches br on br.retailer_id = r.id and br.name = d.branch_name
join public.products pr on pr.name = d.product_name;
