import { useSyncExternalStore } from 'react'
import { noop } from '../utils'

const emptySubscribe = () => noop
const getSnapshot = () => true
const getServerSnapshot = () => false
export const useIsClient = () => useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)
