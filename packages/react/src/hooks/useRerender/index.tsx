import { useCallback, useReducer } from 'react'

type Rerender = () => void
const reducer = (state: number) => state + 1
export const useRerender = (): Rerender => {
  const [, dispatch] = useReducer(reducer, 0)

  return useCallback(() => dispatch(), [])
}
