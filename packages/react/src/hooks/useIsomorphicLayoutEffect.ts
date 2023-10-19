import { useEffect, useLayoutEffect } from 'react'
import { isClient } from '../utils/isClient'

const isClientEnv = isClient()

export const useIsomorphicLayoutEffect = isClientEnv ? useLayoutEffect : useEffect
