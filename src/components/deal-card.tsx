import { useState } from 'react'
import { Clock, Flame, Heart, MapPin, Share2 } from 'lucide-react'

import { daysLeftLabel, formatRand } from '../lib/deals'
import { shareDeal } from '../lib/engagement'

import type { DealRow } from '../lib/deals'

export interface DealEngagement {
  isFav: boolean
  isHot: boolean
  onToggleFav: () => void
}

// Static card (admin duplicate preview) when engagement is omitted;
// interactive feed card when provided. Accuracy voting lives on the deal
// detail screen, not here.
export function DealCard({
  deal,
  engagement,
  onOpen,
}: {
  deal: DealRow
  engagement?: DealEngagement
  onOpen?: () => void
}) {
  const [shareNote, setShareNote] = useState<string | null>(null)
  const saving =
    deal.original_price && deal.original_price > deal.price
      ? deal.original_price - deal.price
      : null

  async function handleShare(e: React.MouseEvent) {
    e.stopPropagation()
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
    <div
      onClick={onOpen}
      role={onOpen ? 'button' : undefined}
      className={`flex h-full gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm ${onOpen ? 'cursor-pointer' : ''}`}
    >
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
              <button
                aria-label="Favourite"
                onClick={(e) => {
                  e.stopPropagation()
                  engagement.onToggleFav()
                }}
              >
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
  )
}
