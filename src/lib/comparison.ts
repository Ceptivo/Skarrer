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

export interface LoggableSaving {
  // null when the saving comes from a mix across several stores
  cheapest_retailer_id: string | null
  cheapest_retailer_name: string
  cheapest_total: number
  average_total: number
  stores_compared: number
  amount_saved: number
}

// What a comparison is worth logging as a savings event (Master Doc §7:
// savings measured against the AVERAGE across stores checked). Only stores
// with equal, maximum coverage are averaged — mixing a 2-of-5 total into the
// average of 5-of-5 totals would fabricate savings. Needs at least two
// comparable stores, matching the savings_events check constraint.
export function savingsFromComparison(totals: StoreTotal[]): LoggableSaving | null {
  if (totals.length < 2) return null
  const bestCoverage = totals[0].priced_items
  const comparable = totals.filter((t) => t.priced_items === bestCoverage)
  if (comparable.length < 2) return null

  const cheapest = comparable.reduce((a, b) => (b.total < a.total ? b : a))
  const average =
    Math.round((comparable.reduce((sum, t) => sum + t.total, 0) / comparable.length) * 100) / 100
  const saved = Math.round((average - cheapest.total) * 100) / 100
  if (saved <= 0) return null

  return {
    cheapest_retailer_id: cheapest.retailer_id,
    cheapest_retailer_name: cheapest.retailer_name,
    cheapest_total: cheapest.total,
    average_total: average,
    stores_compared: comparable.length,
    amount_saved: saved,
  }
}

// ---------------------------------------------------------------------------
// Mix & match: shop different items at different stores.
// ---------------------------------------------------------------------------

export interface ItemStoreOption {
  retailer_id: string
  retailer_name: string
  price: number
}

export interface SplitItem {
  item_id: string
  product_name: string
  quantity: number
  // Stores pricing this item, cheapest first (best price per store).
  options: ItemStoreOption[]
  // Average of the option prices — the per-item baseline a choice is
  // measured against (Master Doc §7: savings vs. average across stores).
  average_price: number
}

// Per-item store options for the basket. Items nobody prices come back with
// empty options so the UI can say so.
export function splitComparison(items: BasketItemInput[], deals: DealInput[]): SplitItem[] {
  return items.map((item) => {
    const itemName = normalizeName(item.product_name)
    const bestPerStore = new Map<string, ItemStoreOption>()
    for (const deal of deals) {
      const matches =
        (item.product_id && deal.product_id === item.product_id) ||
        normalizeName(deal.product_name) === itemName
      if (!matches) continue
      const current = bestPerStore.get(deal.retailer_id)
      if (!current || deal.price < current.price) {
        bestPerStore.set(deal.retailer_id, {
          retailer_id: deal.retailer_id,
          retailer_name: deal.retailer_name,
          price: deal.price,
        })
      }
    }
    const options = [...bestPerStore.values()].sort((a, b) => a.price - b.price)
    const average_price =
      options.length > 0
        ? Math.round((options.reduce((s, o) => s + o.price, 0) / options.length) * 100) / 100
        : 0
    return {
      item_id: item.id,
      product_name: item.product_name,
      quantity: item.quantity,
      options,
      average_price,
    }
  })
}

export interface MixGroup {
  retailer_id: string
  retailer_name: string
  items: Array<{ product_name: string; quantity: number; price: number }>
  subtotal: number
}

export interface MixSummary {
  groups: MixGroup[]
  total: number
  average_total: number
  amount_saved: number
  stores_compared: number
  loggable: LoggableSaving | null
}

// selection maps item_id -> retailer_id; unpriced items and missing entries
// fall back to the cheapest option.
export function mixSummary(
  splitItems: SplitItem[],
  selection: Record<string, string>,
): MixSummary {
  const groups = new Map<string, MixGroup>()
  let total = 0
  let averageTotal = 0
  const allStores = new Set<string>()

  for (const item of splitItems) {
    for (const option of item.options) allStores.add(option.retailer_id)
    if (item.options.length === 0) continue
    const chosen =
      item.options.find((o) => o.retailer_id === selection[item.item_id]) ?? item.options[0]

    const group = groups.get(chosen.retailer_id) ?? {
      retailer_id: chosen.retailer_id,
      retailer_name: chosen.retailer_name,
      items: [],
      subtotal: 0,
    }
    group.items.push({
      product_name: item.product_name,
      quantity: item.quantity,
      price: chosen.price,
    })
    group.subtotal = Math.round((group.subtotal + chosen.price * item.quantity) * 100) / 100
    groups.set(chosen.retailer_id, group)

    total += chosen.price * item.quantity
    averageTotal += item.average_price * item.quantity
  }

  total = Math.round(total * 100) / 100
  averageTotal = Math.round(averageTotal * 100) / 100
  const saved = Math.round((averageTotal - total) * 100) / 100
  const groupList = [...groups.values()].sort((a, b) => b.subtotal - a.subtotal)

  // A saving needs a real comparison behind it: at least two stores pricing
  // things overall (matches the savings_events stores_compared >= 2 check).
  const loggable: LoggableSaving | null =
    allStores.size >= 2 && saved > 0 && groupList.length > 0
      ? {
          cheapest_retailer_id: groupList.length === 1 ? groupList[0].retailer_id : null,
          cheapest_retailer_name:
            groupList.length === 1
              ? groupList[0].retailer_name
              : `${groupList.length} stores`,
          cheapest_total: total,
          average_total: averageTotal,
          stores_compared: allStores.size,
          amount_saved: saved,
        }
      : null

  return {
    groups: groupList,
    total,
    average_total: averageTotal,
    amount_saved: saved,
    stores_compared: allStores.size,
    loggable,
  }
}
