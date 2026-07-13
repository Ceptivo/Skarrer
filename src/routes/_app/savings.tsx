import { Link, createFileRoute } from '@tanstack/react-router'
import { ChevronRight, Medal, Trophy, Zap } from 'lucide-react'

import { SavingsChart } from '../../components/savings-chart'
import { ScreenHeader } from '../../components/screen-header'
import { formatRand } from '../../lib/deals'
import { rankedBy, useLeaderboard, useMyBadges } from '../../lib/leaderboard'
import { useProfile } from '../../lib/profile'
import { summarize, useMonthlySavings } from '../../lib/savings'

export const Route = createFileRoute('/_app/savings')({ component: SavingsScreen })

function SavingsScreen() {
  const { data: rows, isPending } = useMonthlySavings()
  const summary = summarize(rows ?? [])
  const [rand, cents] = summary.thisMonth.toFixed(2).split('.')
  const hasHistory = (rows?.length ?? 0) > 0

  const { data: profile } = useProfile()
  const { data: badges } = useMyBadges()
  const { data: leaderboardRows } = useLeaderboard('all-time')

  const myRank = profile?.leaderboard_opt_in
    ? rankedBy(leaderboardRows ?? [], 'rand').findIndex((r) => r.is_me) + 1
    : 0

  const badgeList = [
    { icon: Medal, label: 'First R500', earned: Boolean(badges?.first_500) },
    { icon: Zap, label: '5-Week Streak', earned: Boolean(badges?.streak_5_week) },
    { icon: Trophy, label: 'Top 10', earned: Boolean(badges?.top_10_all_time) },
  ]

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
          <div>
            <p className="text-[10px] text-muted-foreground">Total saved this year</p>
            <p className="text-sm font-extrabold text-card-foreground">
              {formatRand(summary.yearToDate)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <p className="mb-2 px-1 text-[11px] font-semibold text-muted-foreground">
          YOUR BADGES
        </p>
        <div className="flex justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
          {badgeList.map((b) => {
            const Icon = b.icon
            return (
              <div
                key={b.label}
                className="flex flex-col items-center gap-1"
                style={{ opacity: b.earned ? 1 : 0.35 }}
              >
                <div
                  className={
                    b.earned
                      ? 'flex size-10 items-center justify-center rounded-full bg-brand-soft'
                      : 'flex size-10 items-center justify-center rounded-full bg-muted'
                  }
                >
                  <Icon size={18} className={b.earned ? 'text-brand' : 'text-muted-foreground'} />
                </div>
                <span className="w-16 text-center text-[9px] font-semibold text-muted-foreground">
                  {b.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="px-4 pt-4">
        <Link
          to="/leaderboard"
          className="flex items-center justify-between rounded-2xl bg-brand-dark p-4 shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <Trophy size={20} className="text-coral" />
            <div className="text-left">
              <p className="text-sm font-bold text-white">
                {profile?.leaderboard_opt_in
                  ? myRank > 0
                    ? `You're #${myRank} on Skarrel`
                    : "You're on the leaderboard"
                  : 'See the leaderboard'}
              </p>
              <p className="text-[10px] text-white/60">
                {profile?.leaderboard_opt_in
                  ? 'Tap to view the full leaderboard'
                  : 'Opt in to see how you compare'}
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-white" />
        </Link>
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
