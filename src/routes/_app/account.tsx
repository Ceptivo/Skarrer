import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Check,
  ChevronRight,
  LogOut,
  Megaphone,
  Moon,
  Pencil,
  Sun,
  User,
} from 'lucide-react'

import { ScreenHeader } from '../../components/screen-header'
import { useAuth } from '../../lib/auth'
import { useProfile, useUpdateProfile } from '../../lib/profile'
import { supabase } from '../../lib/supabase'
import { useTheme } from '../../lib/theme'
import { LANGUAGE_LABELS, SUBURB_LABELS } from '../../lib/types'

import type { Language, Suburb } from '../../lib/types'

export const Route = createFileRoute('/_app/account')({ component: AccountScreen })

// Placeholder entries; each becomes functional in its own build chunk.
const comingSoon = [
  'Compare Free vs Premium',
  'Leave a tip',
  'Leaderboard settings',
  'Suggest a feature',
  'Delete my data',
  "What's new (changelog)",
]

function AccountScreen() {
  const { session } = useAuth()
  const { data: profile, isPending } = useProfile()
  const updateProfile = useUpdateProfile()
  const { theme, toggle } = useTheme()

  const [editingNickname, setEditingNickname] = useState(false)
  const [nicknameDraft, setNicknameDraft] = useState('')

  function saveNickname() {
    const nickname = nicknameDraft.trim()
    if (nickname && nickname !== profile?.nickname) {
      updateProfile.mutate({ nickname })
    }
    setEditingNickname(false)
  }

  return (
    <div className="flex min-h-full flex-col">
      <ScreenHeader
        title=""
        top={
          <div className="flex items-center gap-3 pb-1">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/20">
              <User size={22} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              {editingNickname ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={nicknameDraft}
                    onChange={(e) => setNicknameDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveNickname()}
                    maxLength={30}
                    className="w-full rounded-lg bg-white/20 px-2 py-1 text-base font-bold text-white outline-none placeholder:text-white/50"
                  />
                  <button onClick={saveNickname} aria-label="Save nickname">
                    <Check size={18} className="text-white" />
                  </button>
                </div>
              ) : (
                <button
                  className="flex items-center gap-1.5"
                  onClick={() => {
                    setNicknameDraft(profile?.nickname ?? '')
                    setEditingNickname(true)
                  }}
                >
                  <span className="truncate text-base font-bold text-white">
                    {isPending ? '…' : (profile?.nickname ?? 'skarreler')}
                  </span>
                  <Pencil size={13} className="shrink-0 text-white/60" />
                </button>
              )}
              <p className="truncate text-[11px] text-white/70">{session?.user.email}</p>
            </div>
            <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase text-white">
              {profile?.plan ?? 'free'} plan
            </span>
          </div>
        }
      />

      <div className="space-y-2.5 px-4 pt-4 pb-6">
        {profile?.is_admin && (
          <Link
            to="/admin"
            className="flex items-center justify-between rounded-2xl border-2 border-brand bg-card p-4"
          >
            <span className="flex items-center gap-2.5 text-sm font-bold text-brand-dark">
              <span className="rounded-full bg-brand-soft p-2">
                <Megaphone size={16} className="text-brand" />
              </span>
              Post a deal
            </span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </Link>
        )}

        <label className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <span className="text-sm font-semibold text-card-foreground">Home suburb</span>
          <select
            value={profile?.home_suburb ?? ''}
            onChange={(e) =>
              updateProfile.mutate({
                home_suburb: (e.target.value || null) as Suburb | null,
              })
            }
            className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs font-semibold text-foreground"
          >
            <option value="">Not set</option>
            {Object.entries(SUBURB_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <span className="text-sm font-semibold text-card-foreground">Language</span>
          <select
            value={profile?.language ?? 'en'}
            onChange={(e) => updateProfile.mutate({ language: e.target.value as Language })}
            className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs font-semibold text-foreground"
          >
            {Object.entries(LANGUAGE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={toggle}
          className="flex w-full items-center justify-between rounded-2xl border border-border bg-card p-4"
        >
          <span className="flex items-center gap-2.5 text-sm font-semibold text-card-foreground">
            <span className="rounded-full bg-brand-soft p-2">
              {theme === 'dark' ? (
                <Moon size={16} className="text-brand" />
              ) : (
                <Sun size={16} className="text-brand" />
              )}
            </span>
            Dark mode
          </span>
          <span
            className={
              theme === 'dark'
                ? 'relative h-6 w-10 rounded-full bg-brand transition-colors'
                : 'relative h-6 w-10 rounded-full bg-muted transition-colors'
            }
          >
            <span
              className={
                theme === 'dark'
                  ? 'absolute top-0.5 left-[22px] size-5 rounded-full bg-white transition-all'
                  : 'absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-all'
              }
            />
          </span>
        </button>

        {comingSoon.map((label) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-sm font-semibold text-card-foreground opacity-60"
          >
            {label}
            <span className="text-[10px] font-bold text-muted-foreground">SOON</span>
          </div>
        ))}

        <button
          onClick={() => supabase.auth.signOut()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm font-bold text-coral"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  )
}
