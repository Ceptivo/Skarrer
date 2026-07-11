import { createFileRoute } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'

import { Logo } from '../../components/logo'

export const Route = createFileRoute('/_app/')({ component: DealsScreen })

// Category chips come from the categories table once deals are wired up.
const placeholderCategories = ['All', 'Dairy', 'Bakery', 'Meat', 'Pantry', 'Produce']

function DealsScreen() {
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
      </header>

      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        {placeholderCategories.map((category, i) => (
          <span
            key={category}
            className={
              i === 0
                ? 'flex-shrink-0 rounded-full bg-brand px-3.5 py-1.5 text-xs font-semibold text-white'
                : 'flex-shrink-0 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground'
            }
          >
            {category}
          </span>
        ))}
      </div>

      <div className="flex flex-1 items-center justify-center px-8 pb-16">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">
            No deals yet — go skarrel something.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            The deal feed lights up here once deals are posted.
          </p>
        </div>
      </div>
    </div>
  )
}
