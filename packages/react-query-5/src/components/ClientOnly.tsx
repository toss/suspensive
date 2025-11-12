'use client'

import { useSyncExternalStore } from 'react'

const useIsClient = () => useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)

const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export const ClientOnly = ({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) => (
  <>{useIsClient() ? children : fallback}</>
)
