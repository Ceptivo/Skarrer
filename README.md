# Skarrel

Hyper-local grocery deals and savings web app for **Westville, Pinetown and the
Upper Highway**, Durban, South Africa. Aggregates weekly specials from Superspar,
Woolworths, Checkers, Pick n Pay and OK Foods at branch level, compares the
user's regular basket across stores, and tracks how much they've saved.

*Skarrel smart. Save more.*

Full product, business and legal plan: [`docs/skarrel-master-document.md`](docs/skarrel-master-document.md)
(extracted from `docs/Skarrel_Master_Document.docx`). Visual reference for the
screens: [`docs/skarrel-app-mockup-v2.jsx`](docs/skarrel-app-mockup-v2.jsx).

## Stack

- **Frontend:** TanStack Start (React 19) · Tailwind CSS v4 · shadcn/ui · TanStack Query
- **Backend:** Supabase (Postgres, Auth, RLS)
- **Automation:** n8n (scraper workflows, PayFast ITN handling — later chunks)
- **Payments:** PayFast (Premium subscription + tip jar — later chunk)

## Getting started

### 1. Frontend

```bash
npm install
npm run dev        # http://localhost:3000
```

### 2. Supabase

Create a project at [supabase.com](https://supabase.com) (choose a region close
to South Africa), then either:

**Option A — SQL editor (quickest):** paste and run
`supabase/migrations/20260711000001_initial_schema.sql` in the dashboard's SQL
editor.

**Option B — Supabase CLI (recommended once set up):**

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push          # applies migrations
```

For a local dev database: `npx supabase start` then `npx supabase db reset`
(this also runs `supabase/seed.sql` — sample data only, never run it in
production; the branch list in it is unverified placeholder data).

### 3. Environment

```bash
cp .env.example .env.local    # fill in your Supabase URL + anon key
```

### 4. Type generation (optional, once linked)

```bash
npm run gen:types             # writes src/lib/database.types.ts
```

## Project layout

```
docs/                  Planning docs, brand assets, mockup reference
public/icons/          PWA app icon ("sk" mark)
src/routes/            File-based routes: / (Deals), /basket, /savings, /account
src/components/        Shared UI (logo, screen header, bottom tab nav)
src/lib/               Supabase client, utils
supabase/migrations/   Database schema (SQL, versioned)
supabase/seed.sql      Dev-only sample data
```

## Build stages

Built solo, part-time, in deliberate stages — foundation first (schema +
scaffold + shell), then auth, then the admin deal-posting flow and deal feed,
then basket comparison, savings tracking, and onward per the Master Document's
launch scope. See `CLAUDE.md` for the working agreement and current stage.
