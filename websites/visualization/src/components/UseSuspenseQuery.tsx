'use client'

import { useSuspenseQuery } from '@suspensive/react-query'
import { Box } from './uis'

type Props = {
  queryKey: Readonly<[string, number]>
  queryFn: () => Promise<string>
}

export const UseSuspenseQuery = ({ queryKey, queryFn }: Props) => {
  const query = useSuspenseQuery({
    queryKey,
    queryFn,
  })

  return (
    <Box.Success>
      <div>{query.data}</div>
    </Box.Success>
  )
}
