import { describe, expect, it } from 'vitest'

import {
  compareStores,
  mixSummary,
  normalizeName,
  savingsFromComparison,
  splitComparison,
} from './comparison'

import type { BasketItemInput, DealInput } from './comparison'

const item = (name: string, quantity = 1, product_id: string | null = null): BasketItemInput => ({
  id: name,
  product_id,
  product_name: name,
  quantity,
})

const deal = (
  retailer: string,
  name: string,
  price: number,
  product_id: string | null = null,
): DealInput => ({
  retailer_id: retailer,
  retailer_name: retailer,
  product_id,
  product_name: name,
  price,
})

describe('normalizeName', () => {
  it('lowercases and collapses whitespace', () => {
    expect(normalizeName('  Full  Cream Milk 1L ')).toBe('full cream milk 1l')
  })
})

describe('compareStores', () => {
  it('returns empty for an empty basket', () => {
    expect(compareStores([], [deal('Checkers', 'Milk', 10)])).toEqual([])
  })

  it('totals quantities and flags the cheapest comparable store', () => {
    const items = [item('Milk 1L', 2), item('Bread 700g', 1)]
    const deals = [
      deal('Checkers', 'Milk 1L', 20),
      deal('Checkers', 'Bread 700g', 15),
      deal('Pick n Pay', 'Milk 1L', 18),
      deal('Pick n Pay', 'Bread 700g', 16),
    ]
    const result = compareStores(items, deals)
    expect(result).toHaveLength(2)
    expect(result[0].retailer_name).toBe('Pick n Pay') // 2*18+16 = 52
    expect(result[0].total).toBe(52)
    expect(result[0].cheapest).toBe(true)
    expect(result[1].total).toBe(55) // 2*20+15
    expect(result[1].cheapest).toBe(false)
  })

  it('matches case- and whitespace-insensitively', () => {
    const result = compareStores(
      [item('full cream MILK  1l')],
      [deal('Checkers', 'Full Cream Milk 1L', 19)],
    )
    expect(result).toHaveLength(1)
    expect(result[0].total).toBe(19)
  })

  it('matches on product_id even when names differ', () => {
    const result = compareStores(
      [item('Milk (the nice one)', 1, 'prod-1')],
      [deal('Woolworths', 'Full Cream Milk 1L', 25, 'prod-1')],
    )
    expect(result).toHaveLength(1)
    expect(result[0].total).toBe(25)
  })

  it('ranks fuller coverage above a lower partial total', () => {
    const items = [item('Milk 1L'), item('Bread 700g'), item('Eggs 18s')]
    const deals = [
      // Checkers prices all three: total 60
      deal('Checkers', 'Milk 1L', 20),
      deal('Checkers', 'Bread 700g', 15),
      deal('Checkers', 'Eggs 18s', 25),
      // Superspar prices only one, cheaply: total 10
      deal('Superspar', 'Milk 1L', 10),
    ]
    const result = compareStores(items, deals)
    expect(result[0].retailer_name).toBe('Checkers')
    expect(result[0].priced_items).toBe(3)
    expect(result[0].cheapest).toBe(true)
    expect(result[1].retailer_name).toBe('Superspar')
    expect(result[1].cheapest).toBe(false)
  })

  it('uses the best price when a retailer has duplicate live deals', () => {
    const result = compareStores(
      [item('Milk 1L')],
      [deal('Checkers', 'Milk 1L', 22), deal('Checkers', 'Milk 1L', 19)],
    )
    expect(result[0].total).toBe(19)
  })

  it('drops stores that price nothing', () => {
    const result = compareStores(
      [item('Milk 1L')],
      [deal('Checkers', 'Bread 700g', 15), deal('Pick n Pay', 'Milk 1L', 18)],
    )
    expect(result).toHaveLength(1)
    expect(result[0].retailer_name).toBe('Pick n Pay')
  })
})

describe('savingsFromComparison', () => {
  const items = [item('Milk 1L'), item('Bread 700g')]
  const fullDeals = [
    deal('Checkers', 'Milk 1L', 20),
    deal('Checkers', 'Bread 700g', 15),   // total 35
    deal('Pick n Pay', 'Milk 1L', 18),
    deal('Pick n Pay', 'Bread 700g', 16), // total 34
    deal('Woolworths', 'Milk 1L', 25),
    deal('Woolworths', 'Bread 700g', 20), // total 45
  ]

  it('averages comparable stores and reports the saving', () => {
    const saving = savingsFromComparison(compareStores(items, fullDeals))
    expect(saving).not.toBeNull()
    expect(saving!.cheapest_retailer_name).toBe('Pick n Pay')
    expect(saving!.cheapest_total).toBe(34)
    expect(saving!.average_total).toBe(38) // (35+34+45)/3
    expect(saving!.amount_saved).toBe(4)
    expect(saving!.stores_compared).toBe(3)
  })

  it('excludes partial-coverage stores from the average', () => {
    const saving = savingsFromComparison(
      compareStores(items, [...fullDeals, deal('Superspar', 'Milk 1L', 1)]),
    )
    // Superspar prices only 1 of 2 items — must not drag the average down.
    expect(saving!.stores_compared).toBe(3)
    expect(saving!.average_total).toBe(38)
  })

  it('returns null when only one store is comparable', () => {
    const saving = savingsFromComparison(
      compareStores(items, [
        deal('Checkers', 'Milk 1L', 20),
        deal('Checkers', 'Bread 700g', 15),
        deal('Superspar', 'Milk 1L', 10),
      ]),
    )
    expect(saving).toBeNull()
  })

  it('returns null for an empty comparison', () => {
    expect(savingsFromComparison([])).toBeNull()
  })
})

describe('splitComparison / mixSummary', () => {
  const items = [item('Milk 1L', 2), item('Bread 700g'), item('Biltong 200g')]
  const deals = [
    deal('Checkers', 'Milk 1L', 20),
    deal('Checkers', 'Bread 700g', 15),
    deal('Pick n Pay', 'Milk 1L', 18),
    deal('Pick n Pay', 'Bread 700g', 16),
    // nobody prices biltong
  ]

  it('lists per-item store options cheapest-first with averages', () => {
    const split = splitComparison(items, deals)
    expect(split[0].options.map((o) => o.retailer_name)).toEqual(['Pick n Pay', 'Checkers'])
    expect(split[0].average_price).toBe(19)
    expect(split[2].options).toEqual([])
  })

  it('keeps the best price per store when duplicates exist', () => {
    const split = splitComparison(
      [item('Milk 1L')],
      [deal('Checkers', 'Milk 1L', 22), deal('Checkers', 'Milk 1L', 19)],
    )
    expect(split[0].options).toHaveLength(1)
    expect(split[0].options[0].price).toBe(19)
  })

  it('defaults every item to its cheapest store', () => {
    const summary = mixSummary(splitComparison(items, deals), {})
    // milk x2 @ PnP 18, bread @ Checkers 15 → 51; avg 19*2 + 15.5 = 53.5
    expect(summary.total).toBe(51)
    expect(summary.average_total).toBe(53.5)
    expect(summary.amount_saved).toBe(2.5)
    expect(summary.groups).toHaveLength(2)
    expect(summary.loggable?.cheapest_retailer_id).toBeNull() // multi-store mix
    expect(summary.loggable?.stores_compared).toBe(2)
  })

  it('honours a manual store selection', () => {
    const split = splitComparison(items, deals)
    const milkId = split[0].item_id
    const checkers = split[0].options.find((o) => o.retailer_name === 'Checkers')!
    const summary = mixSummary(split, { [milkId]: checkers.retailer_id })
    // milk x2 @ Checkers 20, bread @ Checkers 15 → 55, single store
    expect(summary.total).toBe(55)
    expect(summary.groups).toHaveLength(1)
    // 55 > the 53.5 average — a costlier pick is not a loggable saving
    expect(summary.loggable).toBeNull()
  })

  it('logs a single-store mix under that store when it still saves', () => {
    const split = splitComparison(items, deals)
    const breadId = split[1].item_id
    const pnp = split[1].options.find((o) => o.retailer_name === 'Pick n Pay')!
    // everything at PnP: milk x2 @ 18 (default) + bread @ 16 = 52 vs avg 53.5
    const summary = mixSummary(split, { [breadId]: pnp.retailer_id })
    expect(summary.total).toBe(52)
    expect(summary.groups).toHaveLength(1)
    expect(summary.loggable?.cheapest_retailer_id).toBe(pnp.retailer_id)
    expect(summary.loggable?.amount_saved).toBe(1.5)
  })

  it('is not loggable when only one store prices anything', () => {
    const summary = mixSummary(
      splitComparison([item('Milk 1L')], [deal('Checkers', 'Milk 1L', 20)]),
      {},
    )
    expect(summary.loggable).toBeNull()
    expect(summary.total).toBe(20)
  })
})
