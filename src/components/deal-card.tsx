import { useState } from 'react'
import { Check, Clock, Flame, Heart, MapPin, Share2, X } from 'lucide-react'

import { daysLeftLabel, formatRand } from '../lib/deals'
import { shareDeal } from '../lib/engagement'

import type { DealAccuracy } from '../lib/engagement'
import type { DealRow } from '../lib/deals'

export interface DealEngagement {
  isFav: boolean
  isHot: boolean
  accuracy?: DealAccuracy
  myVote?: boolean
  onToggleFav: () => void
  onVote: (isAccurate: boolean) => void
}

// Static card (admin duplicate preview) when engagement is omitted;
// interactive feed card when provided.
export function DealCard({
  deal,
  engagement,
}: {
  deal: DealRow
  engagement?: DealEngagement
}) {
  const [shareNote, setShareNote] = useState<string | null>(null)
  const saving =
    deal.original_price && deal.original_price > deal.price
      ? deal.original_price - deal.price
      : null

  async function handleShare() {
    try {
      const result = await shareDeal(deal)
      if (result === 'copied') {
        setShareNote('Copied — paste it anywhere')
        setTimeout(() => setShareNote(null), 2500)
      }
    } catch {
      // user cancelled the share sheet — nothing to do
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 shadow-sm">
      <div className="flex gap-3">
        <div className="flex size-[60px] flex-shrink-0 items-center justify-center rounded-xl bg-brand px-1 text-center text-[10px] font-bold leading-tight text-white">
          {deal.retailer?.name ?? '—'}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[14px] font-semibold leading-snug text-card-foreground">
              {deal.product_name}
            </p>
            <div className="flex flex-shrink-0 items-center gap-1.5">
              {engagement?.isHot && (
                <span className="flex items-center gap-0.5 rounded-full bg-coral-soft px-1.5 py-0.5 text-[9px] font-bold text-coral">
                  <Flame size={9} /> HOT
                </span>
              )}
              {deal.is_sponsored && (
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase text-muted-foreground">
                  Sponsored
                </span>
              )}
              {engagement && deal.product_id && (
                <button aria-label="Favourite" onClick={engagement.onToggleFav}>
                  <Heart
                    size={16}
                    className={engagement.isFav ? 'text-coral' : 'text-muted-foreground/50'}
                    fill={engagement.isFav ? 'currentColor' : 'none'}
                  />
                </button>
              )}
              {engagement && (
                <button aria-label="Share deal" onClick={handleShare}>
                  <Share2 size={15} className="text-muted-foreground/50" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin size={10} />
            <span className="truncate">
              {deal.branch?.name ?? 'All branches in the area'}
            </span>
            {deal.retailer?.is_live && (
              <span className="ml-1 flex-shrink-0 rounded-full bg-brand-soft px-1.5 py-px text-[8px] font-bold uppercase text-brand-dark">
                Live
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-end justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-brand">
                {formatRand(deal.price)}
              </span>
              {deal.original_price != null && (
                <span className="text-[10px] text-muted-foreground line-through">
                  {formatRand(deal.original_price)}
                </span>
              )}
            </div>
            {saving && (
              <span className="rounded-full bg-coral px-2 py-0.5 text-[10px] font-bold text-white">
                Save {saving >= 1 ? `R${saving % 1 === 0 ? saving : saving.toFixed(2)}` : formatRand(saving)}
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock size={9} />
              <span>{daysLeftLabel(deal.expires_at)}</span>
            </div>
            {shareNote && (
              <span className="text-[9px] font-semibold text-brand">{shareNote}</span>
            )}
          </div>
        </div>
      </div>

      {engagement && (
        <AccuracyRow
          accuracy={engagement.accuracy}
          myVote={engagement.myVote}
          onVote={engagement.onVote}
        />
      )}
    </div>
  )
}

// Crowd accuracy: "Still accurate?" taps build a per-deal trust score
// (Master Doc §3). One vote per user per deal, changeable.
function AccuracyRow({
  accuracy,
  myVote,
  onVote,
}: {
  accuracy?: DealAccuracy
  myVote?: boolean
  onVote: (isAccurate: boolean) => void
}) {
  return (
    <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2">
      <span className="text-[10px] text-muted-foreground">
        {accuracy && accuracy.checks_count > 0
          ? `${accuracy.accurate_pct}% say accurate (${accuracy.checks_count})`
          : 'Spotted it in-store — still accurate?'}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          aria-label="Confirm accurate"
          onClick={() => onVote(true)}
          className={
            myVote === true
              ? 'flex size-6 items-center justify-center rounded-full bg-brand text-white'
              : 'flex size-6 items-center justify-center rounded-full bg-brand-soft text-brand'
          }
        >
          <Check size={12} />
        </button>
        <button
          aria-label="Report inaccurate"
          onClick={() => onVote(false)}
          className={
            myVote === false
              ? 'flex size-6 items-center justify-center rounded-full bg-coral text-white'
              : 'flex size-6 items-center justify-center rounded-full bg-coral-soft text-coral'
          }
        >
          <X size={12} />
        </button>
      </div>
    </div>
  )
}
