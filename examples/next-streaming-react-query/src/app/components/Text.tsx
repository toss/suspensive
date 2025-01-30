'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { type ComponentProps } from 'react'
import { query } from '~/query'

export const Text = ({ ref, ms, ...props }: ComponentProps<'p'> & { ms: number }) => {
  const { data: text } = useSuspenseQuery(query.text(ms))
  return (
    <p {...props} ref={ref}>
      result: {text}
    </p>
  )
}
