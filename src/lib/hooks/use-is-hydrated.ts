import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

// False while the server renders and while React hydrates, true afterwards. Calculators whose output depends on
// "today" use it so the prerendered HTML never carries a date that can differ from the visitor's own clock.
export function useIsHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false)
}
