import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronDown, ChevronRight, Search, Trophy } from 'lucide-react'

import { DealCard } from '../../components/deal-card'
import { Logo } from '../../components/logo'
import { useActiveDeals, useCategories } from '../../lib/deals'
import { formatRand } from '../../lib/deals'
import {
  useDealAccuracy,
  useFavorites,
  useHotProducts,
  useToggleFavorite,
  useVoteAccuracy,
} from '../../lib/engagement'
import { useWeeklyIndex } from '../../lib/weekly'

export const Route = createFileRoute('/_app/')({ component: DealsScreen })

function DealsScreen() {
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState('')

  const { data: categories } = useCategories()
  const { data: deals, isPending, error } = useActiveDeals({ categoryId, search })

  const { data: favorites } = useFavorites()
  const { data: hotProducts } = useHotProducts()
  const { data: accuracy } = useDealAccuracy(deals?.map((d) => d.id) ?? [])
  const toggleFavorite = useToggleFavorite()
  const voteAccuracy = useVoteAccuracy()

  return (
    <div className="flex min-h-full flex-col">
      <header className="bg-brand px-4 pt-5 pb-4">
        <div className="mb-3 flex items-center justify-between">
          <Logo className="text-lg" />
          <button className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white">
            All Suburbs
            <ChevronDown size={12} />
          </button>
        </div>
        <p className="text-lg font-extrabold text-white">This week's deals</p>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white/15 px-3 py-2">
          <Search size={14} className="text-white/70" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deals…"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/60"
          />
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        <CategoryChip
          label="All"
          active={categoryId === undefined}
          onClick={() => setCategoryId(undefined)}
        />
        {categories?.map((category) => (
          <CategoryChip
            key={category.id}
            label={category.name}
            active={categoryId === category.id}
            onClick={() => setCategoryId(category.id)}
          />
        ))}
      </div>

      <WeeklyIndexCard />

      <div className="flex-1 space-y-2.5 px-4 pb-4">
        {isPending && (
          <p className="pt-10 text-center text-xs text-muted-foreground">
            Loading this week's deals…
          </p>
        )}
        {error && (
          <p className="pt-10 text-center text-xs text-destructive">
            Couldn't load deals — check your connection and try again.
          </p>
        )}
        {deals && deals.length === 0 && (
          <div className="pt-14 text-center">
            <p className="text-sm font-semibold text-foreground">
              No deals yet — go skarrel something.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || categoryId
                ? 'Try a different search or category.'
                : 'New specials land here every week.'}
            </p>
          </div>
        )}
        {deals?.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            engagement={{
              isFav: Boolean(deal.product_id && favorites?.has(deal.product_id)),
              isHot: Boolean(deal.product_id && hotProducts?.has(deal.product_id)),
              accuracy: accuracy?.stats.get(deal.id),
              myVote: accuracy?.myVotes.get(deal.id),
              onToggleFav: () =>
                deal.product_id &&
                toggleFavorite.mutate({
                  productId: deal.product_id,
                  isFav: Boolean(favorites?.has(deal.product_id)),
                }),
              onVote: (isAccurate) => voteAccuracy.mutate({ dealId: deal.id, isAccurate }),
            }}
          />
        ))}
      </div>
    </div>
  )
}

function WeeklyIndexCard() {
  const { data: index } = useWeeklyIndex()
  if (!index?.hasData) return null
  const winnerIdx = index.totals.findIndex((t) => t.cheapest)
  if (winnerIdx < 0) return null

  return (
    <div className="px-4 pb-3">
      <Link
        to="/weekly"
        className="flex items-center justify-between rounded-2xl bg-brand-dark p-3.5 shadow-sm"
      >
        <div className="flex items-center gap-2.5">
          <Trophy size={18} className="text-coral" />
          <div>
            <p className="text-xs font-bold text-white">
              Cheapest Basket This Week: {index.retailers[winnerIdx].name}{' '}
              {formatRand(index.totals[winnerIdx].total)}
            </p>
            <p className="text-[10px] text-white/60">Tap for the full price table</p>
          </div>
        </div>
        <ChevronRight size={15} className="text-white/70" />
      </Link>
    </div>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? 'flex-shrink-0 rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-white'
          : 'flex-shrink-0 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground'
      }
    >
      {label}
    </button>
  )
}
