'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { query } from '~/query'

export const Text = (props: { ms: number }) => {
  const { data: text } = useSuspenseQuery(query.text(props.ms))

  return <div>result: {text}</div>
}
