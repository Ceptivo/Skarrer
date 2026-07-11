import { useState } from 'react'

import { formatRand } from '../lib/deals'

import type { SavingsSummary } from '../lib/savings'

// Monthly savings bar chart (single series — no legend; the card title names
// it). Marks use --chart-mark, validated for both modes; the current month
// carries the only permanent value label, others show on hover/tap.
export function SavingsChart({ history }: { history: SavingsSummary['history'] }) {
  const [active, setActive] = useState<number | null>(null)
  const max = Math.max(...history.map((h) => h.total), 1)

  return (
    <div>
      <div className="flex h-32 items-end gap-2">
        {history.map((entry, i) => {
          const heightPct = entry.total > 0 ? Math.max((entry.total / max) * 100, 4) : 0
          const isCurrent = i === history.length - 1
          const showLabel = active === i || (isCurrent && active === null)
          return (
            <button
              key={entry.month}
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group relative flex h-full flex-1 flex-col items-center justify-end"
              aria-label={`${entry.label}: ${formatRand(entry.total)}`}
            >
              {showLabel && entry.total > 0 && (
                <span className="mb-1 text-[9px] font-bold text-foreground">
                  {entry.total >= 100 ? `R${Math.round(entry.total)}` : formatRand(entry.total)}
                </span>
              )}
              {entry.total > 0 ? (
                <div
                  className="w-full max-w-7 rounded-t bg-chart-mark"
                  style={{ height: `${heightPct}%` }}
                />
              ) : (
                <div className="h-px w-full max-w-7 bg-border" />
              )}
            </button>
          )
        })}
      </div>
      <div className="mt-1.5 flex gap-2 border-t border-border pt-1.5">
        {history.map((entry) => (
          <span
            key={entry.month}
            className="flex-1 text-center text-[9px] font-semibold text-muted-foreground"
          >
            {entry.label}
          </span>
        ))}
      </div>
    </div>
  )
}
