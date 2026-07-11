import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { TabNav } from '../components/tab-nav'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      { title: 'Skarrel — Skarrel smart. Save more.' },
      {
        name: 'description',
        content:
          'Hyper-local grocery deals and savings for Westville, Pinetown and the Upper Highway, Durban.',
      },
      { name: 'theme-color', content: '#0f766e' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/icons/icon.svg' },
      { rel: 'apple-touch-icon', href: '/icons/icon.svg' },
      { rel: 'manifest', href: '/manifest.webmanifest' },
    ],
  }),
  component: AppLayout,
  shellComponent: RootDocument,
})

// Mobile-first shell: single column with the bottom tab bar, per the mockup.
function AppLayout() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-background shadow-xl">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <TabNav />
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
