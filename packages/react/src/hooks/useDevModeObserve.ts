import { useEffect, useReducer } from 'react'
import { suspensiveDevMode } from '../DevMode'
import { increase } from '../utils'

export const useDevModeObserve = () => {
  const render = useReducer(increase, 0)[1]
  useEffect(() => suspensiveDevMode.subscribe(render), [render])
}
