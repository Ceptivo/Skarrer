import { createFileRoute } from '@tanstack/react-router'
import { ShoppingBasket } from 'lucide-react'

import { ScreenHeader } from '../components/screen-header'

export const Route = createFileRoute('/basket')({ component: BasketScreen })

function BasketScreen() {
  return (
    <div className="flex min-h-full flex-col">
      <ScreenHeader title="My Basket" subtitle="Compare your regular shop across stores" />
      <div className="flex flex-1 items-center justify-center px-8 pb-16">
        <div className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-brand-soft">
            <ShoppingBasket size={22} className="text-brand" />
          </div>
          <p className="text-sm font-semibold text-foreground">Create your basket</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Add the items you buy every week and Skarrel shows you which store wins
            for your whole basket — not just single specials.
          </p>
        </div>
      </div>
    </div>
  )
}
