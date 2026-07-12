import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Check,
  Clock,
  Flame,
  Heart,
  MapPin,
  Plus,
  Share2,
  Tag,
  X,
} from 'lucide-react'

import { useAddBasketItem, useDefaultBasket } from '../../lib/basket'
import { daysLeftLabel, formatRand, useDeal } from '../../lib/deals'
import {
  shareDeal,
  useDealAccuracy,
  useFavorites,
  useHotProducts,
  useToggleFavorite,
  useVoteAccuracy,
} from '../../lib/engagement'
import { SUBURB_LABELS } from '../../lib/types'

export const Route = createFileRoute('/_app/deal/$dealId')({ component: DealDetailScreen })

function DealDetailScreen() {
  const { dealId } = Route.useParams()
  const navigate = useNavigate()

  const { data: deal, isPending, error } = useDeal(dealId)
  const { data: favorites } = useFavorites()
  const { data: hotProducts } = useHotProducts()
  const { data: accuracy } = useDealAccuracy(deal ? [deal.id] : [])
  const toggleFavorite = useToggleFavorite()
  const voteAccuracy = useVoteAccuracy()

  const { data: basket } = useDefaultBasket()
  const addToBasket = useAddBasketItem(basket?.id)

  const [shareNote, setShareNote] = useState<string | null>(null)

  if (isPending) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <p className="text-xs text-muted-foreground">Loading deal…</p>
      </div>
    )
  }
  if (error || !deal) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-3 px-8 text-center">
        <p className="text-sm font-semibold text-foreground">
          This deal has gone walkabout.
        </p>
        <button
          onClick={() => navigate({ to: '/' })}
          className="rounded-2xl bg-brand px-4 py-2 text-xs font-bold text-white"
        >
          Back to deals
        </button>
      </div>
    )
  }

  const isFav = Boolean(deal.product_id && favorites?.has(deal.product_id))
  const isHot = Boolean(deal.product_id && hotProducts?.has(deal.product_id))
  const stats = accuracy?.stats.get(deal.id)
  const myVote = accuracy?.myVotes.get(deal.id)
  const saving =
    deal.original_price && deal.original_price > deal.price
      ? deal.original_price - deal.price
      : null

  async function handleShare() {
    try {
      const result = await shareDeal(deal!)
      if (result === 'copied') {
        setShareNote('Copied — paste it anywhere')
        setTimeout(() => setShareNote(null), 2500)
      }
    } catch {
      // share sheet dismissed
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="bg-brand px-4 pt-5 pb-5">
        <button
          onClick={() => window.history.length > 1 ? window.history.back() : navigate({ to: '/' })}
          className="mb-3 flex items-center gap-1 text-xs font-semibold text-white/80"
        >
          <ArrowLeft size={13} />
          Back
        </button>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xl font-extrabold leading-snug text-white">
              {deal.product_name}
            </p>
            <p className="mt-1 text-[12px] text-white/70">{deal.retailer?.name ?? '—'}</p>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2 pt-1">
            {isHot && (
              <span className="flex items-center gap-0.5 rounded-full bg-white/15 px-2 py-1 text-[10px] font-bold text-coral">
                <Flame size={11} /> HOT
              </span>
            )}
            {deal.product_id && (
              <button
                aria-label="Favourite"
                onClick={() =>
                  toggleFavorite.mutate({ productId: deal.product_id!, isFav })
                }
                className="rounded-full bg-white/15 p-2"
              >
                <Heart
                  size={16}
                  className={isFav ? 'text-coral' : 'text-white/80'}
                  fill={isFav ? 'currentColor' : 'none'}
                />
              </button>
            )}
            <button aria-label="Share deal" onClick={handleShare} className="rounded-full bg-white/15 p-2">
              <Share2 size={16} className="text-white/80" />
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-white">
              {formatRand(deal.price)}
            </span>
            {deal.original_price != null && (
              <span className="text-sm text-white/60 line-through">
                {formatRand(deal.original_price)}
              </span>
            )}
          </div>
          {saving && (
            <span className="rounded-full bg-coral px-3 py-1 text-xs font-bold text-white">
              Save {formatRand(saving)}
            </span>
          )}
        </div>
        {shareNote && <p className="mt-2 text-[10px] font-semibold text-white/80">{shareNote}</p>}
      </header>

      <div className="flex-1 space-y-2.5 px-4 pt-4 pb-6">
        <div className="space-y-2.5 rounded-2xl border border-border bg-card p-4 text-xs">
          <DetailRow
            icon={<MapPin size={13} className="text-brand" />}
            label="Where"
            value={
              deal.branch
                ? `${deal.branch.name} (${SUBURB_LABELS[deal.branch.suburb]})`
                : 'All branches in the Westville / Pinetown / Upper Highway area'
            }
          />
          <DetailRow
            icon={<Clock size={13} className="text-brand" />}
            label="Valid"
            value={`${daysLeftLabel(deal.expires_at)} — ends ${new Date(deal.expires_at + 'T00:00:00').toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}`}
          />
          {deal.category && (
            <DetailRow
              icon={<Tag size={13} className="text-brand" />}
              label="Category"
              value={deal.category.name}
            />
          )}
        </div>

        <button
          onClick={() =>
            addToBasket.mutate({
              product_name: deal.product_name,
              product_id: deal.product_id,
            })
          }
          disabled={addToBasket.isPending || addToBasket.isSuccess}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3 text-sm font-bold text-white disabled:opacity-70"
        >
          {addToBasket.isSuccess ? (
            <>
              <Check size={15} /> In your basket
            </>
          ) : (
            <>
              <Plus size={15} /> Add to my basket
            </>
          )}
        </button>

        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-sm font-bold text-card-foreground">Still accurate?</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
            Spotted this in-store? Confirm the price so other skarrelers know it's
            legit — or flag it if the shelf says otherwise.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => voteAccuracy.mutate({ dealId: deal.id, isAccurate: true })}
              className={
                myVote === true
                  ? 'flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-brand py-2.5 text-xs font-bold text-white'
                  : 'flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-brand-soft py-2.5 text-xs font-bold text-brand-dark'
              }
            >
              <Check size={13} />
              {myVote === true ? 'You confirmed it' : 'Still accurate'}
            </button>
            <button
              onClick={() => voteAccuracy.mutate({ dealId: deal.id, isAccurate: false })}
              className={
                myVote === false
                  ? 'flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-coral py-2.5 text-xs font-bold text-white'
                  : 'flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-coral-soft py-2.5 text-xs font-bold text-coral'
              }
            >
              <X size={13} />
              {myVote === false ? 'You flagged it' : 'Price is off'}
            </button>
          </div>
          {stats && stats.checks_count > 0 && (
            <p className="mt-2.5 text-center text-[11px] font-semibold text-muted-foreground">
              {stats.accurate_pct}% of {stats.checks_count} skarreler
              {stats.checks_count === 1 ? '' : 's'} say this price is accurate
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5">{icon}</span>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-card-foreground">{value}</p>
      </div>
    </div>
  )
}
