import { createFileRoute } from '@tanstack/react-router'
import { TrendingDown } from 'lucide-react'

import { SavingsChart } from '../../components/savings-chart'
import { ScreenHeader } from '../../components/screen-header'
import { formatRand } from '../../lib/deals'
import { summarize, useMonthlySavings } from '../../lib/savings'

export const Route = createFileRoute('/_app/savings')({ component: SavingsScreen })

function SavingsScreen() {
  const { data: rows, isPending } = useMonthlySavings()
  const summary = summarize(rows ?? [])
  const [rand, cents] = summary.thisMonth.toFixed(2).split('.')
  const hasHistory = (rows?.length ?? 0) > 0

  return (
    <div className="flex min-h-full flex-col">
      <ScreenHeader
        title="Your Savings"
        subtitle="vs. average price across stores checked"
      >
        <div className="mt-4 pb-2 text-center">
          <p className="text-[10px] font-semibold tracking-wide text-white/70">
            SKARREL'D SO FAR THIS MONTH
          </p>
          <p className="text-[40px] font-extrabold tracking-tight text-white">
            {isPending ? '…' : (
              <>
                R{Number(rand).toLocaleString('en-ZA')}
                <span className="text-xl">.{cents}</span>
              </>
            )}
          </p>
        </div>
      </ScreenHeader>

      <div className="-mt-4 px-4">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-3.5 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-coral-soft p-2">
              <TrendingDown size={15} className="text-coral" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Total saved this year</p>
              <p className="text-sm font-extrabold text-card-foreground">
                {formatRand(summary.yearToDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-6">
        <p className="mb-2 px-1 text-[11px] font-semibold text-muted-foreground">
          MONTHLY BREAKDOWN
        </p>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          {hasHistory ? (
            <SavingsChart history={summary.history} />
          ) : (
            <p className="py-6 text-center text-xs leading-relaxed text-muted-foreground">
              Nothing skarrel'd yet. Build your basket, check which store wins,
              and lock in your first saving — it all stacks up here.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
