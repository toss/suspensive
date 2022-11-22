import { useEffect, useState } from 'react'
import { Box } from './uis'

type BaseAsyncState<IsError extends boolean, Error> = { isError: IsError; error: Error }
type AsyncState = BaseAsyncState<true, unknown> | BaseAsyncState<false, null>

export const ErrorAfter1s = () => {
  const [asyncState, setAsyncState] = useState<AsyncState>({
    isError: false,
    error: null,
  })

  useEffect(() => {
    setTimeout(() => {
      setAsyncState({ isError: true, error: { status: 500, message: 'Server Error' } })
    }, 1000)
  }, [])

  if (asyncState.isError) {
    throw asyncState.error
  }

  return <Box.Success>No error yet</Box.Success>
}
