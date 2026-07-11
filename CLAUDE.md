# Skarrel — working notes for Claude

## What this is

Hyper-local grocery deals & savings PWA for Westville/Pinetown/Upper Highway
(Durban, SA). Five retailers, branch-level deals, best-basket comparison,
always-visible savings tracker. Read `docs/skarrel-master-document.md` before
making product decisions — it is the source of truth for scope, monetization,
legal constraints (POPIA/CPA), and brand voice.

## How Luke works

- Solo, part-time (3–4 hrs/day). Ship in small working stages; never attempt
  the whole launch scope at once.
- Check in before starting a new chunk. Ask before any product decision not
  already settled in the Master Document.
- Manual deal entry ships first; scrapers (n8n) come retailer-by-retailer in
  parallel and flip a per-retailer `is_live` flag.

## Stack & conventions

- TanStack Start (React 19), file-based routes in `src/routes/`.
- Tailwind v4 (CSS-first config in `src/styles.css`) + shadcn/ui
  (`components.json`, alias `#/` → `src/`). Brand tokens: `bg-brand` (teal
  #0F766E), `text-coral` (#FF7A59), `bg-brand-soft`, `bg-coral-soft`.
- Supabase: schema lives in `supabase/migrations/` (never edit applied
  migrations — add new ones). RLS on every table; catalogue tables are
  authenticated-read/admin-write; user data is own-rows-only. The service key
  must never be referenced client-side.
- Match the mockup (`docs/skarrel-app-mockup-v2.jsx`): teal headers, rounded-2xl
  white cards, bottom tab nav (Deals/Basket/Savings/Account), coral accents.
- Copy tone: cheeky SA-local, professional execution ("No deals yet — go
  skarrel something."). Prices always formatted `R18.99`.

## Stage status

- [x] Chunk 1 — Foundation: scaffold, brand shell, schema, seed, PWA manifest
- [ ] Chunk 2 — Auth + profiles (Supabase Auth, RLS live end-to-end)
- [ ] Chunk 3 — Admin deal posting (+ duplicate check) & real deal feed
- [ ] Chunk 4 — Basket + cheapest-store comparison
- [ ] Chunk 5 — Savings tracker (events, monthly chart, YTD)
- [ ] Later — weekly graphic, crowd accuracy, HOT badge, PayFast, leaderboard…

## Known open items (from the plan, not decisions to make silently)

- Real branch list per retailer is unverified (`supabase/seed.sql` uses
  placeholders from the mockup).
- Domain skarrel.co.za and PayFast merchant account not yet registered.
- 2FA-for-all-accounts, i18n (zu/af), and launch-scope trimming are pending
  discussion with Luke.
