import { useSyncExternalStore } from 'react'
import { noop } from '../utils'

function getSnapshot() {
  return false
}

function getServerSnapshot() {
  return true
}

// hook interface instead of useIsClient in hooks
export function useIsClient() {
  return useSyncExternalStore(() => noop, getSnapshot, getServerSnapshot)
}
