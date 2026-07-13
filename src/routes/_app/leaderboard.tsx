import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Trophy } from 'lucide-react'

import { formatRand } from '../../lib/deals'
import { rankByRandSaved, useLeaderboard, type LeaderboardPeriod } from '../../lib/leaderboard'
import { useProfile, useUpdateProfile } from '../../lib/profile'

export const Route = createFileRoute('/_app/leaderboard')({ component: LeaderboardScreen })

const periods: { id: LeaderboardPeriod; label: string }[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'all-time', label: 'All-time' },
]

function LeaderboardScreen() {
  const navigate = useNavigate()
  const { data: profile, isPending: profilePending } = useProfile()
  const updateProfile = useUpdateProfile()

  const [period, setPeriod] = useState<LeaderboardPeriod>('monthly')
  const { data: rows, isPending, error } = useLeaderboard(period)

  const ranked = rows ? rankByRandSaved(rows) : undefined

  return (
    <div className="flex min-h-full flex-col">
      <header className="bg-brand px-4 pt-5 pb-4">
        <button
          onClick={() => navigate({ to: '/savings' })}
          className="mb-2 flex items-center gap-1 text-xs font-semibold text-white/80"
        >
          <ArrowLeft size={13} />
          Back
        </button>
        <p className="text-lg font-extrabold text-white">Leaderboard</p>
        <p className="mt-0.5 text-[11px] text-white/70">
          {profile?.leaderboard_opt_in
            ? `Opted in · visible as "${profile.leaderboard_show_full_name && profile.full_name ? profile.full_name : profile.nickname}"`
            : 'Opt in below to join'}
        </p>
      </header>

      {!profilePending && !profile?.leaderboard_opt_in ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-brand-soft">
            <Trophy size={26} className="text-brand" />
          </div>
          <p className="text-sm font-bold text-foreground">See how you stack up</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Join the leaderboard to see how much you've saved compared to other
            skarrelers. Off by default — you choose to join, and you can leave any
            time from Account.
          </p>
          <button
            onClick={() => updateProfile.mutate({ leaderboard_opt_in: true })}
            disabled={updateProfile.isPending}
            className="mt-5 rounded-2xl bg-brand px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {updateProfile.isPending ? 'Joining…' : 'Join the leaderboard'}
          </button>
          <p className="mt-3 text-[10px] text-muted-foreground">
            You'll show up as your nickname unless you choose to show your full
            name in Account settings.
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-1.5 px-4 pt-3">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={
                  period === p.id
                    ? 'rounded-full bg-brand-dark px-2.5 py-1 text-[10px] font-semibold text-white'
                    : 'rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground'
                }
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-2 px-4 pt-3 pb-6">
            {isPending && (
              <p className="pt-10 text-center text-xs text-muted-foreground">Loading…</p>
            )}
            {error && (
              <p className="pt-10 text-center text-xs text-destructive">
                Couldn't load the leaderboard right now — try again shortly.
              </p>
            )}
            {ranked && ranked.length === 0 && (
              <p className="pt-10 text-center text-xs text-muted-foreground">
                No one's on the board for this period yet — be the first to skarrel
                something.
              </p>
            )}
            {ranked?.map((row, i) => {
              const rank = i + 1
              return (
                <div
                  key={row.display_name + i}
                  className={
                    row.is_me
                      ? 'flex items-center justify-between rounded-2xl border-[1.5px] border-coral bg-card p-3 shadow-sm'
                      : 'flex items-center justify-between rounded-2xl border border-border bg-card p-3 shadow-sm'
                  }
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        rank <= 3
                          ? 'w-5 text-center text-sm font-extrabold text-coral'
                          : 'w-5 text-center text-sm font-extrabold text-muted-foreground'
                      }
                    >
                      {rank}
                    </span>
                    <div className="flex size-[30px] items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                      {row.display_name[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-card-foreground">
                      {row.is_me ? 'You' : row.display_name}
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-brand">
                    {formatRand(row.period_saved)}
                  </span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
