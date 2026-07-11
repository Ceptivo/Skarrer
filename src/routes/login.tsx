import { useState } from 'react'
import { Navigate, createFileRoute } from '@tanstack/react-router'

import { Logo } from '../components/logo'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/login')({ component: LoginScreen })

type Mode = 'signin' | 'signup'

function LoginScreen() {
  const { session, loading } = useAuth()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  if (!loading && session) return <Navigate to="/" />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { nickname: nickname.trim() || undefined } },
        })
        if (err) throw err
        // With email confirmation enabled there's no session until the link
        // in the mail is clicked.
        if (!data.session) {
          setNotice('Almost there — check your email to confirm your account.')
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col bg-brand">
      <div className="flex flex-col items-center px-6 pt-16 pb-10 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-white text-3xl font-extrabold tracking-tighter">
          <span className="text-brand">s</span>
          <span className="text-coral">k</span>
        </div>
        <Logo className="mt-4 text-3xl" />
        <p className="mt-1 text-sm italic text-white/80">Skarrel smart. Save more.</p>
      </div>

      <div className="flex-1 rounded-t-3xl bg-background px-6 pt-6 pb-10">
        <h1 className="text-lg font-extrabold text-foreground">
          {mode === 'signin' ? 'Welcome back' : 'Join the skarrel'}
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {mode === 'signin'
            ? 'Sign in to see this week’s deals.'
            : 'One account, all the Westville/Pinetown/Upper Highway specials.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Nickname (shown if you join the leaderboard)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={30}
              className="w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          )}
          <input
            type="email"
            required
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Password (min 8 characters)"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />

          {error && (
            <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {error}
            </p>
          )}
          {notice && (
            <p className="rounded-xl bg-brand-soft px-3 py-2 text-xs font-medium text-brand-dark">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-brand py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy ? 'One sec…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError(null)
            setNotice(null)
          }}
          className="mt-4 w-full text-center text-xs font-semibold text-brand-dark"
        >
          {mode === 'signin'
            ? 'New here? Create an account'
            : 'Already skarrelling? Sign in'}
        </button>
      </div>
    </div>
  )
}
