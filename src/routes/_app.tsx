import { Navigate, Outlet, createFileRoute } from '@tanstack/react-router'

import { Logo } from '../components/logo'
import { TabNav } from '../components/tab-nav'
import { useAuth } from '../lib/auth'
import { isSupabaseConfigured } from '../lib/supabase'

export const Route = createFileRoute('/_app')({ component: AppLayout })

// Auth gate around the four tab screens: signed-out users go to /login.
function AppLayout() {
  const { session, loading } = useAuth()

  if (!isSupabaseConfigured) return <SetupNotice />
  if (loading) return <Splash />
  if (!session) return <Navigate to="/login" />

  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <TabNav />
    </>
  )
}

function Splash() {
  return (
    <div className="flex flex-1 items-center justify-center bg-brand">
      <Logo className="text-3xl" />
    </div>
  )
}

function SetupNotice() {
  return (
    <div className="flex flex-1 items-center justify-center px-8">
      <div className="rounded-2xl border border-border bg-card p-5 text-sm">
        <p className="font-bold text-foreground">Supabase isn't configured yet</p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Copy <code>.env.example</code> to <code>.env.local</code>, fill in your
          project URL and anon key, and restart the dev server. Setup steps are in
          the README.
        </p>
      </div>
    </div>
  )
}
