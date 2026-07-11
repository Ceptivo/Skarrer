import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { supabase } from './supabase'
import { useAuth } from './auth'

import type { LoggableSaving } from './comparison'

export interface MonthlySaving {
  month: string // ISO timestamp of month start
  total_saved: number
  comparisons: number
}

export function useLogSavings(basketId?: string) {
  const { session } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (saving: LoggableSaving) => {
      const userId = session?.user.id
      if (!userId) throw new Error('Not signed in')
      const { error } = await supabase.from('savings_events').insert({
        user_id: userId,
        basket_id: basketId ?? null,
        cheapest_retailer_id: saving.cheapest_retailer_id,
        cheapest_total: saving.cheapest_total,
        average_total: saving.average_total,
        stores_compared: saving.stores_compared,
      })
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savings'] }),
  })
}

export function useMonthlySavings() {
  const { session } = useAuth()
  return useQuery({
    queryKey: ['savings', session?.user.id],
    enabled: Boolean(session),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_savings')
        .select('month, total_saved, comparisons')
        .order('month', { ascending: true })
      if (error) throw error
      return data as MonthlySaving[]
    },
  })
}

export interface SavingsSummary {
  thisMonth: number
  yearToDate: number
  // Last six calendar months ending now, zero-filled for empty months.
  history: Array<{ label: string; month: string; total: number }>
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function summarize(rows: MonthlySaving[], now = new Date()): SavingsSummary {
  const byMonth = new Map<string, number>()
  for (const row of rows) {
    const d = new Date(row.month)
    byMonth.set(`${d.getUTCFullYear()}-${d.getUTCMonth()}`, Number(row.total_saved))
  }

  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()

  let yearToDate = 0
  for (let m = 0; m <= month; m++) {
    yearToDate += byMonth.get(`${year}-${m}`) ?? 0
  }

  const history: SavingsSummary['history'] = []
  for (let back = 5; back >= 0; back--) {
    const d = new Date(Date.UTC(year, month - back, 1))
    history.push({
      label: MONTH_LABELS[d.getUTCMonth()],
      month: d.toISOString().slice(0, 10),
      total: byMonth.get(`${d.getUTCFullYear()}-${d.getUTCMonth()}`) ?? 0,
    })
  }

  return {
    thisMonth: byMonth.get(`${year}-${month}`) ?? 0,
    yearToDate: Math.round(yearToDate * 100) / 100,
    history,
  }
}
