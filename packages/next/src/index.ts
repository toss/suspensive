'use client'

import type { headers as nextHeaders } from 'next/headers'

export const nextComponentType = ():
  | 'React Server Component'
  | 'React Client Component (browser)'
  | 'React Client Component (server)' =>
  typeof window === 'undefined' ? 'React Client Component (server)' : 'React Client Component (browser)'

export const headers: typeof nextHeaders = (() =>
  Promise.resolve<undefined>(undefined)) as unknown as typeof nextHeaders
