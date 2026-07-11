import { Link } from '@tanstack/react-router'
import { Home, PiggyBank, ShoppingBasket, User } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Deals', icon: Home },
  { to: '/basket', label: 'Basket', icon: ShoppingBasket },
  { to: '/savings', label: 'Savings', icon: PiggyBank },
  { to: '/account', label: 'Account', icon: User },
] as const

export function TabNav() {
  return (
    <nav className="flex items-center justify-around border-t border-border bg-card px-2 py-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))]">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-muted-foreground [&.active]:text-brand"
            activeOptions={{ exact: tab.to === '/' }}
          >
            <Icon size={19} />
            <span className="text-[9px] font-semibold">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
