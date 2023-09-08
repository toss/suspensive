import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'
import { PropsWithoutChildren } from './types'

type DelayProps = PropsWithChildren<{
  ms?: number
}>
export const Delay = ({ ms, children }: DelayProps) => {
  const delayContextValue = useContext(DelayContext)
  const delayMs = ms ?? delayContextValue.ms ?? 0
  const [isDelayed, setIsDelayed] = useState(delayMs === 0)

  useEffect(() => {
    const timerId = setTimeout(() => setIsDelayed(true), delayMs)
    return () => clearTimeout(timerId)
  }, [delayMs])

  return <>{isDelayed ? children : null}</>
}

export const DelayContext = createContext<PropsWithoutChildren<DelayProps>>({ ms: 0 })
