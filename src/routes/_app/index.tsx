import { useMemo, useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronDown, ChevronRight, Search, Trophy } from 'lucide-react'

import { DealCard } from '../../components/deal-card'
import { Logo } from '../../components/logo'
import { useActiveDeals, useCategories } from '../../lib/deals'
import { formatRand } from '../../lib/deals'
import { useFavorites, useHotProducts, useToggleFavorite } from '../../lib/engagement'
import { useWeeklyIndex } from '../../lib/weekly'

import type { DealRow } from '../../lib/deals'

export const Route = createFileRoute('/_app/')({ component: DealsScreen })

function DealsScreen() {
  const [search, setSearch] = useState('')
  const searching = search.trim().length > 0

  const { data: categories } = useCategories()
  const { data: deals, isPending, error } = useActiveDeals({ search })

  // Feed layout per Luke: vertical list of category sections, each a
  // horizontally scrollable row of deals from every store.
  const sections = useMemo(() => {
    if (!deals || !categories) return undefined
    const byCategory = new Map<string, DealRow[]>()
    for (const deal of deals) {
      const key = deal.category?.id ?? 'other'
      const list = byCategory.get(key) ?? []
      list.push(deal)
      byCategory.set(key, list)
    }
    const result: Array<{ id: string; name: string; deals: DealRow[] }> = []
    for (const category of categories) {
      const list = byCategory.get(category.id)
      if (list?.length) result.push({ id: category.id, name: category.name, deals: list })
    }
    const other = byCategory.get('other')
    if (other?.length) result.push({ id: 'other', name: 'More deals', deals: other })
    return result
  }, [deals, categories])

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

      <div className="pt-3">
        <WeeklyIndexCard />
      </div>

      <div className="flex-1 pb-4">
        {isPending && (
          <p className="pt-10 text-center text-xs text-muted-foreground">
            Loading this week's deals…
          </p>
        )}
        {error && (
          <p className="px-4 pt-10 text-center text-xs text-destructive">
            Couldn't load deals — check your connection and try again.
          </p>
        )}
        {deals && deals.length === 0 && (
          <div className="px-8 pt-14 text-center">
            <p className="text-sm font-semibold text-foreground">
              No deals yet — go skarrel something.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {searching ? 'Try a different search.' : 'New specials land here every week.'}
            </p>
          </div>
        )}

        {searching ? (
          <div className="space-y-2.5 px-4">
            {deals?.map((deal) => (
              <FeedDealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          sections?.map((section) => (
            <section key={section.id} className="mt-2">
              <h2 className="px-4 pb-2 text-[13px] font-extrabold tracking-wide text-foreground">
                {section.name}
                <span className="ml-1.5 text-[10px] font-semibold text-muted-foreground">
                  {section.deals.length}
                </span>
              </h2>
              <div className="flex gap-2.5 overflow-x-auto px-4 pb-3">
                {section.deals.map((deal) => (
                  <div key={deal.id} className="w-[290px] flex-shrink-0">
                    <FeedDealCard deal={deal} />
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}

function FeedDealCard({ deal }: { deal: DealRow }) {
  const navigate = useNavigate()
  const { data: favorites } = useFavorites()
  const { data: hotProducts } = useHotProducts()
  const toggleFavorite = useToggleFavorite()

  return (
    <DealCard
      deal={deal}
      onOpen={() => navigate({ to: '/deal/$dealId', params: { dealId: deal.id } })}
      engagement={{
        isFav: Boolean(deal.product_id && favorites?.has(deal.product_id)),
        isHot: Boolean(deal.product_id && hotProducts?.has(deal.product_id)),
        onToggleFav: () =>
          deal.product_id &&
          toggleFavorite.mutate({
            productId: deal.product_id,
            isFav: Boolean(favorites?.has(deal.product_id)),
          }),
      }}
    />
  )
}

function WeeklyIndexCard() {
  const { data: index } = useWeeklyIndex()
  if (!index?.hasData) return null
  const winnerIdx = index.totals.findIndex((t) => t.cheapest)
  if (winnerIdx < 0) return null

  return (
    <div className="px-4 pb-1">
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
