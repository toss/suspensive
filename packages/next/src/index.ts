'use client'

import type { headers as nextHeaders } from 'next/headers'

/**
 * @experimental This is experimental feature.
 */
export const nextComponentType = ():
  | 'React Server Component'
  | 'React Client Component (browser)'
  | 'React Client Component (server)' =>
  typeof window === 'undefined' ? 'React Client Component (server)' : 'React Client Component (browser)'

/**
 * @experimental This is experimental feature.
 */
export const headers: typeof nextHeaders = (() =>
  Promise.resolve<undefined>(undefined)) as unknown as typeof nextHeaders
