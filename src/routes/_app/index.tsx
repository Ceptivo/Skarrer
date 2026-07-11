import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ChevronDown, Search } from 'lucide-react'

import { DealCard } from '../../components/deal-card'
import { Logo } from '../../components/logo'
import { useActiveDeals, useCategories } from '../../lib/deals'

export const Route = createFileRoute('/_app/')({ component: DealsScreen })

function DealsScreen() {
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState('')

  const { data: categories } = useCategories()
  const { data: deals, isPending, error } = useActiveDeals({ categoryId, search })

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
        {deals?.map((deal) => <DealCard key={deal.id} deal={deal} />)}
      </div>
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
