-- Catalogue reference data: the five launch retailers and the feed
-- categories. Safe to run in production (idempotent). Branches are
-- deliberately NOT included — the real Westville/Pinetown/Upper Highway
-- branch list is still to be enumerated and verified (Master Doc §8).

insert into public.retailers (name, slug) values
  ('Superspar', 'superspar'),
  ('Woolworths', 'woolworths'),
  ('Checkers', 'checkers'),
  ('Pick n Pay', 'pick-n-pay'),
  ('OK Foods', 'ok-foods')
on conflict (slug) do nothing;

insert into public.categories (name, slug, sort_order) values
  ('Dairy', 'dairy', 1),
  ('Bakery', 'bakery', 2),
  ('Meat', 'meat', 3),
  ('Pantry', 'pantry', 4),
  ('Produce', 'produce', 5)
on conflict (slug) do nothing;
