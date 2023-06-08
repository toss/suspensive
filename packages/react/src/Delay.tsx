'use client'

import { ComponentType, ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { ComponentPropsWithoutChildren } from './types'

export const DelayContext = createContext<{ ms?: number }>({ ms: 0 })

type DelayProps = { ms?: number; children: ReactNode }
/**
 * @experimental This is experimental feature.
 */
export const Delay = ({ ms, children }: DelayProps) => {
  const delayContextValue = useContext(DelayContext)
  const delayMs = ms ?? delayContextValue.ms ?? 0
  const [isDelayed, setIsDelayed] = useState(delayMs === 0)

  useEffect(() => {
    const timerId = setTimeout(() => !isDelayed && setIsDelayed(true), delayMs)
    return () => clearTimeout(timerId)
  }, [delayMs])

  return <>{isDelayed ? children : null}</>
}
