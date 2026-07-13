import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// nitro() lets TanStack Start's build target any Nitro-supported host
// (Vercel included) — Nitro auto-detects the platform at build time from
// the hosting provider's own build-environment variables, no extra
// per-provider config needed here.
const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [devtools(), tailwindcss(), tanstackStart(), nitro(), viteReact()],
})

export default config
