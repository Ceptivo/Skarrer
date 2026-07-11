import { describe, expect, it } from 'vitest'

import { compareStores, normalizeName, savingsFromComparison } from './comparison'

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
