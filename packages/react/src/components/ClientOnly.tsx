import { type SuspenseProps, useSyncExternalStore } from 'react'
import { noop } from '../utils'

function getSnapshot() {
  return false
}

function getServerSnapshot() {
  return true
}

// hook interface instead of useIsClient in hooks
function useIsClient() {
  return useSyncExternalStore(() => noop, getSnapshot, getServerSnapshot)
}

export const ClientOnly = ({ children, fallback }: SuspenseProps) => {
  const isClient = useIsClient()

  return isClient ? <>{children}</> : <>{fallback}</>
}
