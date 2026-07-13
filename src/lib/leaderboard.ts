import { useQuery } from '@tanstack/react-query'

import { supabase } from './supabase'
import { useAuth } from './auth'

export type LeaderboardPeriod = 'weekly' | 'monthly' | 'all-time'
export type LeaderboardMetric = 'rand' | 'achievements'

export interface LeaderboardRow {
  display_name: string
  period_saved: number
  badge_count: number
  is_me: boolean
}

export interface MyBadges {
  first_500: boolean
  streak_5_week: boolean
  top_10_all_time: boolean
}

function periodRange(period: LeaderboardPeriod): { start: string; end: string } {
  const now = new Date()
  if (period === 'weekly') {
    const day = now.getDay()
    const monday = new Date(now)
    monday.setHours(0, 0, 0, 0)
    monday.setDate(now.getDate() - ((day + 6) % 7))
    const nextMonday = new Date(monday)
    nextMonday.setDate(monday.getDate() + 7)
    return { start: monday.toISOString(), end: nextMonday.toISOString() }
  }
  if (period === 'monthly') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return { start: start.toISOString(), end: end.toISOString() }
  }
  return { start: '2000-01-01T00:00:00Z', end: '2100-01-01T00:00:00Z' }
}

export function useMyBadges() {
  const { session } = useAuth()
  return useQuery({
    queryKey: ['my-badges', session?.user.id],
    enabled: Boolean(session),
    // A missing-function error (migration not applied yet) never resolves
    // itself on retry, so fail fast instead of the default 3x backoff.
    retry: false,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_my_badges')
      if (error) throw error
      return (data?.[0] ?? {
        first_500: false,
        streak_5_week: false,
        top_10_all_time: false,
      }) as MyBadges
    },
  })
}

// Fetches the full opted-in roster for a period once; sorting by rand vs.
// achievements happens client-side on the same dataset (small — only
// opted-in users — so no extra round trip per metric tab).
export function useLeaderboard(period: LeaderboardPeriod) {
  const { session } = useAuth()
  return useQuery({
    queryKey: ['leaderboard', period, session?.user.id],
    enabled: Boolean(session),
    retry: false,
    queryFn: async () => {
      const { start, end } = periodRange(period)
      const { data, error } = await supabase.rpc('get_leaderboard', {
        period_start: start,
        period_end: end,
      })
      if (error) throw error
      return (data ?? []) as LeaderboardRow[]
    },
  })
}

export function rankedBy(rows: LeaderboardRow[], metric: LeaderboardMetric): LeaderboardRow[] {
  const key = metric === 'rand' ? 'period_saved' : 'badge_count'
  return [...rows].sort((a, b) => b[key] - a[key] || a.display_name.localeCompare(b.display_name))
}
