import { createFileRoute } from '@tanstack/react-router'
import { User } from 'lucide-react'

import { ScreenHeader } from '../components/screen-header'

export const Route = createFileRoute('/account')({ component: AccountScreen })

// Placeholder entries; each becomes functional in its own build chunk.
const menuItems = [
  'Compare Free vs Premium',
  'Leave a tip',
  'Leaderboard settings',
  'Dark mode',
  'Suggest a feature',
  "What's new (changelog)",
]

function AccountScreen() {
  return (
    <div className="flex min-h-full flex-col">
      <ScreenHeader
        title="Account"
        top={
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-white/20">
              <User size={22} className="text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-white">Guest</p>
              <p className="text-[11px] text-white/70">Sign in coming soon</p>
            </div>
          </div>
        }
      />
      <div className="space-y-2.5 px-4 pt-4 pb-6">
        {menuItems.map((label) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 text-sm font-semibold text-card-foreground opacity-60"
          >
            {label}
            <span className="text-[10px] font-bold text-muted-foreground">SOON</span>
          </div>
        ))}
      </div>
    </div>
  )
}
