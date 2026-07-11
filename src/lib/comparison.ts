// Cheapest-store comparison (Master Doc §1, §7). Pure logic, no I/O, so it
// can be unit-tested and reused by the public Basket Index later.
//
// Launch matching is name-based (no barcodes — §3 technical note): a deal
// prices a basket item when their product_id matches, or their normalised
// names are equal. With manual deal entry not every store prices every item,
// so stores are ranked by how many items they price first, then by total —
// comparing a 5-of-5 total against a 2-of-5 total would be misleading.

export interface BasketItemInput {
  id: string
  product_id: string | null
  product_name: string
  quantity: number
}

export interface DealInput {
  retailer_id: string
  retailer_name: string
  product_id: string | null
  product_name: string
  price: number
}

export interface StoreTotal {
  retailer_id: string
  retailer_name: string
  total: number
  priced_items: number
  cheapest: boolean
}

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase()
}

export function compareStores(
  items: BasketItemInput[],
  deals: DealInput[],
): StoreTotal[] {
  if (items.length === 0) return []

  const byRetailer = new Map<string, { name: string; deals: DealInput[] }>()
  for (const deal of deals) {
    const entry = byRetailer.get(deal.retailer_id) ?? { name: deal.retailer_name, deals: [] }
    entry.deals.push(deal)
    byRetailer.set(deal.retailer_id, entry)
  }

  const totals: StoreTotal[] = []
  for (const [retailerId, { name, deals: retailerDeals }] of byRetailer) {
    let total = 0
    let priced = 0
    for (const item of items) {
      const itemName = normalizeName(item.product_name)
      const matches = retailerDeals.filter(
        (deal) =>
          (item.product_id && deal.product_id === item.product_id) ||
          normalizeName(deal.product_name) === itemName,
      )
      if (matches.length > 0) {
        // Several live deals for the same product at one retailer (e.g. a
        // price update posted over an old entry): take the best price.
        const best = Math.min(...matches.map((m) => m.price))
        total += best * item.quantity
        priced += 1
      }
    }
    if (priced > 0) {
      totals.push({
        retailer_id: retailerId,
        retailer_name: name,
        total: Math.round(total * 100) / 100,
        priced_items: priced,
        cheapest: false,
      })
    }
  }

  // Most items priced first; total breaks ties.
  totals.sort((a, b) => b.priced_items - a.priced_items || a.total - b.total)

  // "Cheapest" only means something against a comparable store: flag the
  // lowest total among stores that price the same (maximum) number of items.
  if (totals.length > 0) {
    const bestCoverage = totals[0].priced_items
    const comparable = totals.filter((t) => t.priced_items === bestCoverage)
    if (comparable.length > 1 || totals.length === 1) {
      comparable[0].cheapest = true
    } else {
      // A single store with better coverage than the rest still "wins".
      totals[0].cheapest = true
    }
  }

  return totals
}
