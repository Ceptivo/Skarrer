import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { AuthProvider } from '../lib/auth'
import { ThemeProvider } from '../lib/theme'

import appCss from '../styles.css?url'

// Applies the saved/preferred theme before paint so there's no flash of the
// wrong mode. Kept as a tiny inline script since React hasn't hydrated yet.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('skarrel-theme');
    var dark = stored === 'dark' || (!stored && matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`

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
      // iOS ignores the manifest for install metadata — these tags are what
      // actually drive "Add to Home Screen" there.
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'Skarrel' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/icons/icon.svg' },
      // Safari does not support SVG for apple-touch-icon — must be PNG.
      { rel: 'apple-touch-icon', href: '/icons/apple-touch-icon.png' },
      { rel: 'manifest', href: '/manifest.webmanifest' },
    ],
  }),
  component: AppLayout,
  shellComponent: RootDocument,
})

// Mobile-first shell: single phone-width column, per the mockup. The bottom
// tab bar lives in the _app layout so the login screen renders without it.
function AppLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-background shadow-xl">
          <Outlet />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the theme-init script sets this class
    // before hydration and the server can't know the client's stored
    // preference, so a mismatch here is expected, not a bug.
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
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
