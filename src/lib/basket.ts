import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { compareStores } from './comparison'
import { supabase } from './supabase'
import { useAuth } from './auth'

import type { StoreTotal } from './comparison'

export interface BasketItem {
  id: string
  basket_id: string
  product_id: string | null
  product_name: string
  quantity: number
}

export interface ProductSuggestion {
  id: string
  name: string
}

// Single default basket for now; multi-list management is a later chunk —
// the schema already supports it.
export function useDefaultBasket() {
  const { session } = useAuth()
  const userId = session?.user.id

  return useQuery({
    queryKey: ['basket', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data: existing, error } = await supabase
        .from('baskets')
        .select('id, name')
        .eq('is_default', true)
        .limit(1)
        .maybeSingle()
      if (error) throw error
      if (existing) return existing

      const { data: created, error: createErr } = await supabase
        .from('baskets')
        .insert({ user_id: userId!, name: 'My Basket', is_default: true })
        .select('id, name')
        .single()
      if (createErr) throw createErr
      return created
    },
  })
}

export function useBasketItems(basketId?: string) {
  return useQuery({
    queryKey: ['basket-items', basketId],
    enabled: Boolean(basketId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('basket_items')
        .select('id, basket_id, product_id, product_name, quantity')
        .eq('basket_id', basketId!)
        .order('created_at')
      if (error) throw error
      return data as BasketItem[]
    },
  })
}

export function useAddBasketItem(basketId?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { product_name: string; product_id?: string | null }) => {
      if (!basketId) throw new Error('No basket yet')
      const name = input.product_name.trim().replace(/\s+/g, ' ')
      if (!name) throw new Error('Item name is empty')
      const { error } = await supabase.from('basket_items').insert({
        basket_id: basketId,
        product_name: name,
        product_id: input.product_id ?? null,
        quantity: 1,
      })
      if (error) throw error
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['basket-items', basketId] }),
  })
}

export function useSetItemQuantity(basketId?: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (quantity <= 0) {
        const { error } = await supabase.from('basket_items').delete().eq('id', itemId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('basket_items')
          .update({ quantity })
          .eq('id', itemId)
        if (error) throw error
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['basket-items', basketId] }),
  })
}

// Autocomplete against the canonical product list so basket items link to
// product_ids where possible — that makes store matching exact.
export function useProductSuggestions(search: string) {
  const term = search.trim()
  return useQuery({
    queryKey: ['product-suggestions', term.toLowerCase()],
    enabled: term.length >= 2,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .ilike('name', `%${term}%`)
        .limit(6)
      if (error) throw error
      return data as ProductSuggestion[]
    },
  })
}

// Store totals for the current basket, computed from this week's live deals.
export function useStoreComparison(items?: BasketItem[]) {
  const itemsKey = items?.map((i) => `${i.product_name}x${i.quantity}`).join('|') ?? ''
  return useQuery({
    queryKey: ['store-comparison', itemsKey],
    enabled: Boolean(items && items.length > 0),
    queryFn: async (): Promise<StoreTotal[]> => {
      const today = new Date().toISOString().slice(0, 10)
      const { data: deals, error } = await supabase
        .from('deals')
        .select('product_id, product_name, price, retailer:retailers(id, name)')
        .eq('status', 'active')
        .gte('expires_at', today)
      if (error) throw error

      return compareStores(
        items!,
        (deals ?? []).flatMap((deal) => {
          const retailer = deal.retailer as unknown as { id: string; name: string } | null
          if (!retailer) return []
          return [
            {
              retailer_id: retailer.id,
              retailer_name: retailer.name,
              product_id: deal.product_id,
              product_name: deal.product_name,
              price: deal.price,
            },
          ]
        }),
      )
    },
  })
}
