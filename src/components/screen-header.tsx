import type { ReactNode } from 'react'

// Teal screen header used across all tabs, matching the mockup.
export function ScreenHeader({
  title,
  subtitle,
  top,
  children,
}: {
  title?: string
  subtitle?: string
  top?: ReactNode
  children?: ReactNode
}) {
  return (
    <header className="bg-brand px-4 pt-5 pb-4">
      {top}
      {title && <p className="text-lg font-extrabold text-white">{title}</p>}
      {subtitle && <p className="mt-0.5 text-[11px] text-white/70">{subtitle}</p>}
      {children}
    </header>
  )
}
