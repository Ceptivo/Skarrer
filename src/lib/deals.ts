import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { supabase } from './supabase'

import type { Suburb } from './types'

export interface Retailer {
  id: string
  name: string
  slug: string
  is_live: boolean
}

export interface Branch {
  id: string
  retailer_id: string
  name: string
  suburb: Suburb
}

export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
}

export interface DealRow {
  id: string
  product_name: string
  price: number
  original_price: number | null
  is_sponsored: boolean
  starts_at: string
  expires_at: string
  created_at: string
  retailer: Retailer | null
  branch: Pick<Branch, 'id' | 'name' | 'suburb'> | null
  category: Pick<Category, 'id' | 'name' | 'slug'> | null
}

const DEAL_SELECT =
  'id, product_name, price, original_price, is_sponsored, starts_at, expires_at, created_at, ' +
  'retailer:retailers(id, name, slug, is_live), ' +
  'branch:branches(id, name, suburb), ' +
  'category:categories(id, name, slug)'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order')
      if (error) throw error
      return data as Category[]
    },
  })
}

export function useRetailers() {
  return useQuery({
    queryKey: ['retailers'],
    queryFn: async () => {
      const { data, error } = await supabase.from('retailers').select('*').order('name')
      if (error) throw error
      return data as Retailer[]
    },
  })
}

export function useBranches(retailerId?: string) {
  return useQuery({
    queryKey: ['branches', retailerId ?? 'all'],
    queryFn: async () => {
      let query = supabase.from('branches').select('*').eq('is_active', true).order('name')
      if (retailerId) query = query.eq('retailer_id', retailerId)
      const { data, error } = await query
      if (error) throw error
      return data as Branch[]
    },
  })
}

export function useActiveDeals(options: { categoryId?: string; search?: string }) {
  const { categoryId, search } = options
  return useQuery({
    queryKey: ['deals', categoryId ?? 'all', search ?? ''],
    queryFn: async () => {
      let query = supabase
        .from('deals')
        .select(DEAL_SELECT)
        .eq('status', 'active')
        .gte('expires_at', todayISO())
        .order('created_at', { ascending: false })
      if (categoryId) query = query.eq('category_id', categoryId)
      if (search?.trim()) query = query.ilike('product_name', `%${search.trim()}%`)
      const { data, error } = await query
      if (error) throw error
      return data as unknown as DealRow[]
    },
  })
}

export interface NewDeal {
  retailer_id: string
  branch_id: string | null
  category_id: string | null
  product_name: string
  price: number
  original_price: number | null
  starts_at: string
  expires_at: string
}

// Likely duplicates: same retailer + same branch (or both branch-wide) +
// case-insensitive product name match, still live. Informs, never blocks
// (Master Doc §7: Luke can push through a genuine price update).
export async function findDuplicateDeals(deal: {
  retailer_id: string
  branch_id: string | null
  product_name: string
}): Promise<DealRow[]> {
  let query = supabase
    .from('deals')
    .select(DEAL_SELECT)
    .eq('status', 'active')
    .gte('expires_at', todayISO())
    .eq('retailer_id', deal.retailer_id)
    .ilike('product_name', deal.product_name.trim().replace(/\s+/g, ' '))
  query = deal.branch_id
    ? query.eq('branch_id', deal.branch_id)
    : query.is('branch_id', null)
  const { data, error } = await query
  if (error) throw error
  return data as unknown as DealRow[]
}

export function useCreateDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (deal: NewDeal) => {
      const productName = deal.product_name.trim().replace(/\s+/g, ' ')

      // Reuse or create the canonical product so basket matching and
      // favourites have a stable identity to hang off later.
      const normalized = productName.toLowerCase()
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('normalized_name', normalized)
        .maybeSingle()

      let productId = existing?.id as string | undefined
      if (!productId) {
        const { data: created, error: prodErr } = await supabase
          .from('products')
          .insert({ name: productName, category_id: deal.category_id })
          .select('id')
          .single()
        if (prodErr) throw prodErr
        productId = created.id
      }

      const { error } = await supabase.from('deals').insert({
        ...deal,
        product_name: productName,
        product_id: productId,
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
    },
  })
}

export function daysLeftLabel(expiresAt: string): string {
  const today = new Date(todayISO())
  const expiry = new Date(expiresAt)
  const days = Math.round((expiry.getTime() - today.getTime()) / 86_400_000)
  if (days <= 0) return 'Last day'
  if (days === 1) return '1 day left'
  return `${days} days left`
}

export function formatRand(value: number): string {
  return `R${value.toFixed(2)}`
}
