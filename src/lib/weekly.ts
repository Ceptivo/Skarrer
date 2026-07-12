import { useQuery } from '@tanstack/react-query'

import { supabase } from './supabase'

// ---------------------------------------------------------------------------
// "Cheapest Basket This Week" — pure index builder (unit-tested) + data hook.
// ---------------------------------------------------------------------------

export interface IndexRetailer {
  id: string
  name: string
}

export interface IndexProductRow {
  product_id: string
  name: string
  sort_order: number
}

export interface IndexDeal {
  product_id: string | null
  retailer_id: string
  price: number
}

export interface WeeklyIndexRow {
  product: IndexProductRow
  // aligned with the retailers array; null = no live special
  prices: Array<number | null>
  cheapestIdx: number | null
}

export interface WeeklyIndexTotal {
  total: number
  pricedCount: number
  cheapest: boolean
}

export interface WeeklyIndex {
  retailers: IndexRetailer[]
  rows: WeeklyIndexRow[]
  totals: WeeklyIndexTotal[]
  // true when at least one cell is priced
  hasData: boolean
}

export function buildWeeklyIndex(
  products: IndexProductRow[],
  retailers: IndexRetailer[],
  deals: IndexDeal[],
): WeeklyIndex {
  const retailerIdx = new Map(retailers.map((r, i) => [r.id, i]))

  const rows: WeeklyIndexRow[] = [...products]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((product) => {
      const prices: Array<number | null> = retailers.map(() => null)
      for (const deal of deals) {
        if (deal.product_id !== product.product_id) continue
        const idx = retailerIdx.get(deal.retailer_id)
        if (idx === undefined) continue
        if (prices[idx] === null || deal.price < prices[idx]!) prices[idx] = deal.price
      }
      let cheapestIdx: number | null = null
      prices.forEach((price, i) => {
        if (price !== null && (cheapestIdx === null || price < prices[cheapestIdx]!)) {
          cheapestIdx = i
        }
      })
      return { product, prices, cheapestIdx }
    })

  const totals: WeeklyIndexTotal[] = retailers.map((_, i) => {
    let total = 0
    let priced = 0
    for (const row of rows) {
      const price = row.prices[i]
      if (price !== null) {
        total += price
        priced += 1
      }
    }
    return { total: Math.round(total * 100) / 100, pricedCount: priced, cheapest: false }
  })

  // Same fairness rule as the basket comparison: the winner is the lowest
  // total among stores pricing the most items.
  const maxCoverage = Math.max(...totals.map((t) => t.pricedCount), 0)
  if (maxCoverage > 0) {
    let winner = -1
    totals.forEach((t, i) => {
      if (t.pricedCount === maxCoverage && (winner === -1 || t.total < totals[winner].total)) {
        winner = i
      }
    })
    if (winner >= 0) totals[winner].cheapest = true
  }

  return { retailers, rows, totals, hasData: maxCoverage > 0 }
}

// Current week as "14–20 JUL" (Mon–Sun), matching the locked graphic design.
export function weekRangeLabel(now = new Date()): string {
  const day = now.getDay() // 0 = Sun
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((day + 6) % 7))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getDate()}–${sunday.getDate()} ${months[monday.getMonth()]}`
  }
  return `${monday.getDate()} ${months[monday.getMonth()]} – ${sunday.getDate()} ${months[sunday.getMonth()]}`
}

export function useWeeklyIndex() {
  return useQuery({
    queryKey: ['weekly-index'],
    queryFn: async (): Promise<WeeklyIndex> => {
      const today = new Date().toISOString().slice(0, 10)

      const [indexRes, retailersRes] = await Promise.all([
        supabase
          .from('index_products')
          .select('product_id, sort_order, product:products(name)')
          .order('sort_order'),
        supabase.from('retailers').select('id, name').order('name'),
      ])
      if (indexRes.error) throw indexRes.error
      if (retailersRes.error) throw retailersRes.error

      const products: IndexProductRow[] = (indexRes.data ?? []).map((row) => ({
        product_id: row.product_id,
        sort_order: row.sort_order,
        name: (row.product as unknown as { name: string } | null)?.name ?? '?',
      }))

      const productIds = products.map((p) => p.product_id)
      let deals: IndexDeal[] = []
      if (productIds.length > 0) {
        const { data, error } = await supabase
          .from('deals')
          .select('product_id, retailer_id, price')
          .eq('status', 'active')
          .gte('expires_at', today)
          .in('product_id', productIds)
        if (error) throw error
        deals = (data ?? []) as IndexDeal[]
      }

      return buildWeeklyIndex(products, retailersRes.data ?? [], deals)
    },
  })
}
