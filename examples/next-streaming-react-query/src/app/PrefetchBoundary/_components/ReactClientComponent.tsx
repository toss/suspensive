'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { query } from '~/query'

export const ReactClientComponent = () => {
  const { data } = useSuspenseQuery(query.text(1000))
  return <div>{data}</div>
}
