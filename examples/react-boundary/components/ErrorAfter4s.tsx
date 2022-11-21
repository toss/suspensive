import { useEffect, useState } from 'react'

type BaseAsyncState<IsError extends boolean, Error> = { isError: IsError; error: Error }
type AsyncState = BaseAsyncState<true, any> | BaseAsyncState<false, null>

export const ErrorAfter4s = () => {
  const [asyncState, setAsyncState] = useState<AsyncState>({
    isError: false,
    error: null,
  })

  useEffect(() => {
    setTimeout(() => {
      setAsyncState({ isError: true, error: { status: 401, message: 'unauthorized' } })
    }, 4000)
  }, [])

  if (asyncState.isError) {
    throw asyncState.error
  }

  return <>No error</>
}
