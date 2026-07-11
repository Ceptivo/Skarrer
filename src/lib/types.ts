// Hand-written row types for the tables the app touches. Once the Supabase
// project is linked, `npm run gen:types` generates the full Database type
// and these can be replaced by aliases into it.

export type Suburb = 'westville' | 'pinetown' | 'upper_highway'
export type Language = 'en' | 'zu' | 'af'
export type PlanTier = 'free' | 'premium'

export interface Profile {
  id: string
  nickname: string
  full_name: string | null
  home_suburb: Suburb | null
  language: Language
  plan: PlanTier
  is_admin: boolean
  leaderboard_opt_in: boolean
  leaderboard_show_full_name: boolean
  phone_verified: boolean
  created_at: string
  updated_at: string
}

export const SUBURB_LABELS: Record<Suburb, string> = {
  westville: 'Westville',
  pinetown: 'Pinetown',
  upper_highway: 'Upper Highway',
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  zu: 'isiZulu',
  af: 'Afrikaans',
}
