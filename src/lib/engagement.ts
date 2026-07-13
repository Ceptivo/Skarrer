import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { supabase } from './supabase'
import { useAuth } from './auth'
import { formatRand } from './deals'

import type { DealRow } from './deals'

// HOT badge thresholds: a product needs at least this many combined
// favourites + basket adds, and only the top N qualify. Usage-driven only —
// never sold (Master Doc §4).
const HOT_MIN_SIGNALS = 3
const HOT_TOP_N = 5

export function useFavorites() {
  const { session } = useAuth()
  return useQuery({
    queryKey: ['favorites', session?.user.id],
    enabled: Boolean(session),
    queryFn: async () => {
      const { data, error } = await supabase.from('favorites').select('product_id')
      if (error) throw error
      return new Set((data ?? []).map((row) => row.product_id as string))
    },
  })
}

export function useToggleFavorite() {
  const { session } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ productId, isFav }: { productId: string; isFav: boolean }) => {
      const userId = session?.user.id
      if (!userId) throw new Error('Not signed in')
      if (isFav) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, product_id: productId })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['hot-products'] })
    },
  })
}

export function useHotProducts() {
  return useQuery({
    queryKey: ['hot-products'],
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_popularity')
        .select('product_id, popularity')
        .gte('popularity', HOT_MIN_SIGNALS)
        .order('popularity', { ascending: false })
        .limit(HOT_TOP_N)
      if (error) throw error
      return new Set((data ?? []).map((row) => row.product_id as string))
    },
  })
}

export interface DealAccuracy {
  accurate_pct: number
  checks_count: number
}

// Aggregate crowd-accuracy per deal (from the deal_accuracy view) plus the
// current user's own vote, batched for the whole feed.
export function useDealAccuracy(dealIds: string[]) {
  const { session } = useAuth()
  const key = [...dealIds].sort().join(',')
  return useQuery({
    queryKey: ['deal-accuracy', key, session?.user.id],
    enabled: Boolean(session) && dealIds.length > 0,
    queryFn: async () => {
      const [statsRes, mineRes] = await Promise.all([
        supabase
          .from('deal_accuracy')
          .select('deal_id, accurate_pct, checks_count')
          .in('deal_id', dealIds),
        supabase.from('deal_checks').select('deal_id, is_accurate').in('deal_id', dealIds),
      ])
      if (statsRes.error) throw statsRes.error
      if (mineRes.error) throw mineRes.error
      return {
        stats: new Map(
          (statsRes.data ?? []).map((row) => [
            row.deal_id as string,
            {
              accurate_pct: Number(row.accurate_pct),
              checks_count: Number(row.checks_count),
            } satisfies DealAccuracy,
          ]),
        ),
        myVotes: new Map(
          (mineRes.data ?? []).map((row) => [row.deal_id as string, row.is_accurate as boolean]),
        ),
      }
    },
  })
}

export function useVoteAccuracy() {
  const { session } = useAuth()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ dealId, isAccurate }: { dealId: string; isAccurate: boolean }) => {
      const userId = session?.user.id
      if (!userId) throw new Error('Not signed in')
      const { error } = await supabase
        .from('deal_checks')
        .upsert(
          { deal_id: dealId, user_id: userId, is_accurate: isAccurate },
          { onConflict: 'deal_id,user_id' },
        )
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deal-accuracy'] }),
  })
}

// Per-deal share: native share sheet where available, clipboard otherwise.
export async function shareDeal(deal: DealRow): Promise<'shared' | 'copied'> {
  const where = [deal.retailer?.name, deal.branch?.name].filter(Boolean).join(' ')
  const was = deal.original_price ? ` (was ${formatRand(deal.original_price)})` : ''
  const text = `${deal.product_name} for ${formatRand(deal.price)}${was} at ${where} — spotted on Skarrel. Skarrel smart, save more! skarrel.com`

  if (typeof navigator !== 'undefined' && navigator.share) {
    await navigator.share({ text })
    return 'shared'
  }
  await navigator.clipboard.writeText(text)
  return 'copied'
}
