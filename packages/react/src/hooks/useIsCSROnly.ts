import { useState } from 'react'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

export const useIsCSROnly = () => {
  const [isClient, setIsClient] = useState(false)

  useIsomorphicLayoutEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
