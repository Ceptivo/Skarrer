import { useState } from 'react'
import { Navigate, createFileRoute } from '@tanstack/react-router'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

import { DealCard } from '../../components/deal-card'
import { ScreenHeader } from '../../components/screen-header'
import {
  findDuplicateDeals,
  useBranches,
  useCategories,
  useCreateDeal,
  useRetailers,
} from '../../lib/deals'
import { useProfile } from '../../lib/profile'

import type { DealRow, NewDeal } from '../../lib/deals'

export const Route = createFileRoute('/_app/admin')({ component: AdminScreen })

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function plusDaysISO(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

const emptyForm = () => ({
  retailer_id: '',
  branch_id: '',
  category_id: '',
  product_name: '',
  price: '',
  original_price: '',
  starts_at: todayISO(),
  expires_at: plusDaysISO(6),
})

function AdminScreen() {
  const { data: profile, isPending: profilePending } = useProfile()

  const { data: retailers } = useRetailers()
  const { data: categories } = useCategories()

  const [form, setForm] = useState(emptyForm())
  const { data: branches } = useBranches(form.retailer_id || undefined)
  const createDeal = useCreateDeal()

  const [duplicates, setDuplicates] = useState<DealRow[] | null>(null)
  const [pendingDeal, setPendingDeal] = useState<NewDeal | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [posted, setPosted] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // Admin-only screen: everyone else goes back to the feed.
  if (!profilePending && profile && !profile.is_admin) return <Navigate to="/" />

  function set<K extends keyof ReturnType<typeof emptyForm>>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value, ...(key === 'retailer_id' ? { branch_id: '' } : null) }))
  }

  function buildDeal(): NewDeal | string {
    if (!form.retailer_id) return 'Pick a retailer.'
    if (!form.product_name.trim()) return 'Enter the product name (include the size, e.g. "Full Cream Milk 1L").'
    const price = Number.parseFloat(form.price)
    if (!Number.isFinite(price) || price <= 0) return 'Enter a valid special price.'
    const original = form.original_price ? Number.parseFloat(form.original_price) : null
    if (original !== null && (!Number.isFinite(original) || original <= 0))
      return 'The original price looks off — leave it blank if unknown.'
    if (form.expires_at < form.starts_at) return 'The expiry date is before the start date.'
    return {
      retailer_id: form.retailer_id,
      branch_id: form.branch_id || null,
      category_id: form.category_id || null,
      product_name: form.product_name,
      price,
      original_price: original,
      starts_at: form.starts_at,
      expires_at: form.expires_at,
    }
  }

  async function submit(deal: NewDeal) {
    setBusy(true)
    setError(null)
    try {
      await createDeal.mutateAsync(deal)
      setPosted(deal.product_name)
      setForm(emptyForm())
      setDuplicates(null)
      setPendingDeal(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Posting failed — try again.')
    } finally {
      setBusy(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPosted(null)
    setError(null)
    const deal = buildDeal()
    if (typeof deal === 'string') {
      setError(deal)
      return
    }
    setBusy(true)
    try {
      // Duplicate check informs, never blocks (Master Doc §7).
      const dupes = await findDuplicateDeals(deal)
      if (dupes.length > 0) {
        setDuplicates(dupes)
        setPendingDeal(deal)
        setBusy(false)
        return
      }
    } catch {
      // If the check itself fails, fall through and post normally.
    }
    await submit(deal)
  }

  const inputClass =
    'w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring'
  const labelClass = 'block text-xs font-semibold text-muted-foreground mb-1.5 px-1'

  return (
    <div className="flex min-h-full flex-col">
      <ScreenHeader title="Post a deal" subtitle="Admin only — goes live in the feed immediately" />

      <form onSubmit={handleSubmit} className="space-y-4 px-4 pt-4 pb-8">
        {posted && (
          <p className="flex items-center gap-2 rounded-2xl bg-brand-soft px-4 py-3 text-xs font-semibold text-brand-dark">
            <CheckCircle2 size={14} className="shrink-0" />
            "{posted}" is live. Lekker — post the next one.
          </p>
        )}

        <div>
          <label className={labelClass}>Retailer</label>
          <select
            value={form.retailer_id}
            onChange={(e) => set('retailer_id', e.target.value)}
            className={inputClass}
          >
            <option value="">Select retailer…</option>
            {retailers?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Branch</label>
          <select
            value={form.branch_id}
            onChange={(e) => set('branch_id', e.target.value)}
            className={inputClass}
            disabled={!form.retailer_id}
          >
            <option value="">All branches in the area</option>
            {branches?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select
            value={form.category_id}
            onChange={(e) => set('category_id', e.target.value)}
            className={inputClass}
          >
            <option value="">No category</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Product (include size)</label>
          <input
            value={form.product_name}
            onChange={(e) => set('product_name', e.target.value)}
            placeholder='e.g. "Full Cream Milk 1L"'
            className={inputClass}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelClass}>Special price (R)</label>
            <input
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              inputMode="decimal"
              placeholder="18.99"
              className={inputClass}
            />
          </div>
          <div className="flex-1">
            <label className={labelClass}>Was (R, optional)</label>
            <input
              value={form.original_price}
              onChange={(e) => set('original_price', e.target.value)}
              inputMode="decimal"
              placeholder="24.99"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelClass}>Starts</label>
            <input
              type="date"
              value={form.starts_at}
              onChange={(e) => set('starts_at', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex-1">
            <label className={labelClass}>Expires</label>
            <input
              type="date"
              value={form.expires_at}
              onChange={(e) => set('expires_at', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-xs font-medium text-destructive">
            {error}
          </p>
        )}

        {duplicates && pendingDeal ? (
          <div className="space-y-3 rounded-2xl border-2 border-coral bg-coral-soft p-4">
            <p className="flex items-center gap-2 text-xs font-bold text-coral">
              <AlertTriangle size={14} className="shrink-0" />
              Hold up — this looks like a deal that's already live:
            </p>
            {duplicates.map((dupe) => (
              <DealCard key={dupe.id} deal={dupe} />
            ))}
            <p className="text-[11px] text-muted-foreground">
              Post anyway if this is a genuine price update or re-run.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => submit(pendingDeal)}
                className="flex-1 rounded-2xl bg-coral py-2.5 text-xs font-bold text-white disabled:opacity-60"
              >
                Post anyway
              </button>
              <button
                type="button"
                onClick={() => {
                  setDuplicates(null)
                  setPendingDeal(null)
                }}
                className="flex-1 rounded-2xl border border-border bg-card py-2.5 text-xs font-bold text-muted-foreground"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-brand py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy ? 'Checking…' : 'Post deal'}
          </button>
        )}
      </form>
    </div>
  )
}
