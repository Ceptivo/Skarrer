import { describe, expect, it } from 'vitest'

import { buildWeeklyIndex, weekRangeLabel } from './weekly'

const retailers = [
  { id: 'r1', name: 'Checkers' },
  { id: 'r2', name: 'Pick n Pay' },
]
const products = [
  { product_id: 'p1', name: 'Milk 1L', sort_order: 1 },
  { product_id: 'p2', name: 'Bread 700g', sort_order: 2 },
]

describe('buildWeeklyIndex', () => {
  it('is empty-safe', () => {
    const index = buildWeeklyIndex(products, retailers, [])
    expect(index.hasData).toBe(false)
    expect(index.rows[0].prices).toEqual([null, null])
    expect(index.totals.every((t) => !t.cheapest)).toBe(true)
  })

  it('marks per-item cheapest and the winning total', () => {
    const index = buildWeeklyIndex(products, retailers, [
      { product_id: 'p1', retailer_id: 'r1', price: 20 },
      { product_id: 'p1', retailer_id: 'r2', price: 18 },
      { product_id: 'p2', retailer_id: 'r1', price: 15 },
      { product_id: 'p2', retailer_id: 'r2', price: 16 },
    ])
    expect(index.rows[0].cheapestIdx).toBe(1) // milk cheapest at PnP
    expect(index.rows[1].cheapestIdx).toBe(0) // bread cheapest at Checkers
    expect(index.totals[0]).toMatchObject({ total: 35, cheapest: false })
    expect(index.totals[1]).toMatchObject({ total: 34, cheapest: true })
  })

  it('prefers coverage over a lower partial total', () => {
    const index = buildWeeklyIndex(products, retailers, [
      { product_id: 'p1', retailer_id: 'r1', price: 20 },
      { product_id: 'p2', retailer_id: 'r1', price: 15 }, // full coverage: 35
      { product_id: 'p1', retailer_id: 'r2', price: 5 },  // partial: 5
    ])
    expect(index.totals[0].cheapest).toBe(true)
    expect(index.totals[1].cheapest).toBe(false)
  })

  it('uses the best price for duplicate live deals', () => {
    const index = buildWeeklyIndex(products, retailers, [
      { product_id: 'p1', retailer_id: 'r1', price: 22 },
      { product_id: 'p1', retailer_id: 'r1', price: 19 },
    ])
    expect(index.rows[0].prices[0]).toBe(19)
  })
})

describe('weekRangeLabel', () => {
  it('formats a same-month week', () => {
    expect(weekRangeLabel(new Date('2026-07-15'))).toBe('13–19 JUL')
  })
  it('formats a month-crossing week', () => {
    expect(weekRangeLabel(new Date('2026-07-31'))).toBe('27 JUL – 2 AUG')
  })
})
