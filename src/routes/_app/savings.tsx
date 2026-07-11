import { createFileRoute } from '@tanstack/react-router'

import { ScreenHeader } from '../../components/screen-header'

export const Route = createFileRoute('/_app/savings')({ component: SavingsScreen })

function SavingsScreen() {
  return (
    <div className="flex min-h-full flex-col">
      <ScreenHeader
        title="Your Savings"
        subtitle="vs. average price across stores checked"
      >
        <div className="mt-4 pb-2 text-center">
          <p className="text-[10px] font-semibold tracking-wide text-white/70">
            SKARREL'D SO FAR THIS MONTH
          </p>
          <p className="text-[40px] font-extrabold tracking-tight text-white">
            R0<span className="text-xl">.00</span>
          </p>
        </div>
      </ScreenHeader>
      <div className="flex flex-1 items-center justify-center px-8 pb-16">
        <p className="text-center text-xs text-muted-foreground">
          Run your first basket comparison and your savings start stacking up here.
        </p>
      </div>
    </div>
  )
}
