import { useIsomorphicLayoutEffect } from '@suspensive/utils'
import { useState } from 'react'

export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false)

  useIsomorphicLayoutEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
