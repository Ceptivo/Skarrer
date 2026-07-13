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
- [x] Chunk 2 — Auth + profiles (email/password, auth gate, Account screen;
      awaiting Luke's live Supabase project for a real end-to-end pass.
      2FA enforcement still an open product decision)
- [x] Chunk 3 — Admin deal posting (+ duplicate check) & real deal feed
      (feed + posting form built and UI-tested live; admin posting flow
      awaits Luke's first real deal. Reference-data migration 0002 must be
      run in prod — retailers/categories were empty)
- [x] Chunk 4 — Basket + cheapest-store comparison (single default basket;
      comparison logic in src/lib/comparison.ts is pure + unit-tested;
      stores ranked by coverage then total. Multi-list UI still to come)
- [x] Chunk 5 — Savings tracker (lock-in card on basket comparison logs
      events vs. comparable-store average; Savings screen has month figure,
      YTD, 6-month chart. savings_events are insert/select-only by design)
- [x] Chunk 5b — Mix & match (Luke's request): per-item store selection with
      cheapest pre-selected, per-store shopping list, combined total, own
      lock-in (multi-store events log with null cheapest_retailer_id)
- [x] Chunk 6 — Cheapest Basket This Week (index_products migration 0003,
      /weekly table screen, feed entry card) + shareable graphic generator
      (client-side SVG/PNG faithful to the locked design; partial totals
      annotated "N of M items"). Admin form gained product autocomplete
- [x] Chunk 7 — Crowd accuracy ("still accurate?" votes, per-deal trust
      score, changeable), favourites hearts (migration 0004), HOT badge
      (top 5 products with ≥3 favourites+basket-adds, usage-only), per-deal
      share (native sheet / clipboard fallback)
- [x] Chunk 7b — Luke's feed redesign: vertical category-row sections
      (horizontally scrollable per category) instead of filter chips; deal
      cards no longer carry voting — tapping a card opens /deal/$dealId
      (full detail, add-to-basket, "Still accurate?" voting lives there)
- [x] Chunk 8 — PWA polish: dark mode toggle (persisted, no flash-of-wrong-
      theme via inline head script, suppressHydrationWarning on <html>),
      first-open onboarding (3 slides, localStorage-gated, skippable),
      real PNG/maskable icons for Add-to-Home-Screen (iOS needs PNG —
      SVG-only apple-touch-icon silently fails there)
- [x] Chunk 8b — Dark mode brand teal recalibrated (Luke's feedback: too
      neon/turquoise). Old value gave white header text only ~2.5:1
      contrast (fails WCAG's 3:1 floor); new #0e8a7c keeps the same hue,
      pulled down in lightness/chroma: header text ~4.25:1, brand-as-icon-
      accent ~4.36:1. --brand-soft darkened to match so icons on it still
      read (~3.23:1); --brand-dark left untouched (was already fine)
- [x] Chunk 9 — Leaderboard + achievement badges (migration 0005: two
      security-definer SQL functions, get_my_badges/get_leaderboard —
      verified against a scratch Postgres with opted-in/opted-out/zero-
      savings users before shipping). 3 badges live (First R500, 5-Week
      Streak, Top 10); Student badge deferred — needs a verification
      method decision. Leaderboard opt-in stays off by default per ToS
      §7a; opted-out users' totals never leak even in aggregate
- [ ] Later — PayFast (on hold — awaiting Luke's merchant account),
      referrals (needs a phone-verification provider decision)…

## Known open items (from the plan, not decisions to make silently)

- Real branch list per retailer is unverified (`supabase/seed.sql` uses
  placeholders from the mockup).
- Domain: Luke bought skarrel.com on GoDaddy (not skarrel.co.za as
  originally planned) — purchased but not yet set up/pointed anywhere.
- PayFast merchant account not yet registered. Luke's decision: hold
  PayFast build until the real merchant account exists (no sandbox build
  in the meantime). When it does happen, the ITN webhook lives in the
  app itself, not n8n (Luke's call).
- 2FA-for-all-accounts, i18n (zu/af), and launch-scope trimming are pending
  discussion with Luke.
- Referral program needs a phone-verification provider (SMS OTP) chosen
  before it can be built — external dependency, not yet decided.
- Student achievement badge needs a verification method decided (manual
  review? domain-checked student email? self-attested?) before building.
