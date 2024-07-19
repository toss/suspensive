import { noop } from '@suspensive/utils'
import { useSyncExternalStore } from 'react'

const emptySubscribe = () => noop
const getSnapshot = () => true
const getServerSnapshot = () => false
export const useIsClient = () => useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)
