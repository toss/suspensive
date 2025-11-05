'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { query } from '~/query'

export const ReactClientComponent = ({ ms }: { ms: number }) => {
  const { data } = useSuspenseQuery(query.text(ms))
  return <div>{data}</div>
}
