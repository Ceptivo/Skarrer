import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { supabase } from './supabase'
import { useAuth } from './auth'

import type { Language, Profile, Suburb } from './types'

export function useProfile() {
  const { session } = useAuth()
  const userId = session?.user.id

  return useQuery({
    queryKey: ['profile', userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId!)
        .single()
      if (error) throw error
      return data as Profile
    },
  })
}

export interface ProfileUpdate {
  nickname?: string
  full_name?: string | null
  home_suburb?: Suburb | null
  language?: Language
}

export function useUpdateProfile() {
  const { session } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (update: ProfileUpdate) => {
      const userId = session?.user.id
      if (!userId) throw new Error('Not signed in')
      const { error } = await supabase.from('profiles').update(update).eq('id', userId)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
