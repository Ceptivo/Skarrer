// First-open tutorial gate (Master Doc §7: "New users complete a short
// tutorial on first open, then land on the deals feed — not a separate
// home/dashboard screen"). Tracked client-side per device, not per account —
// deliberately lightweight; no schema needed for a one-time nudge.
const STORAGE_KEY = 'skarrel-onboarded'

export function hasSeenOnboarding(): boolean {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(STORAGE_KEY) === '1'
}

export function markOnboardingSeen() {
  window.localStorage.setItem(STORAGE_KEY, '1')
}
