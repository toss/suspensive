import { type PropsWithChildren, useState } from 'react'
import { useTimeout } from '~/hooks'

export const Throw = {
  Error: ({ message, after = 0, children }: PropsWithChildren<{ message: string; after?: number }>) => {
    const [isNeedThrow, setIsNeedThrow] = useState(after === 0)
    if (isNeedThrow) {
      throw new Error(message)
    }
    useTimeout(() => setIsNeedThrow(true), after)
    return <>{children}</>
  },
}
