import { useSuspenseQuery } from '@suspensive/react-query'
import { Box, Description } from './uis'

type Props = {
  queryKey: ['query' | 'boundary', number]
  queryFn: () => Promise<{ data: string }>
}

export const UseSuspenseQuery = ({ queryKey, queryFn }: Props) => {
  const { data } = useSuspenseQuery(queryKey, queryFn)

  return (
    <Box.Success>
      <Description.Success>{data.data}</Description.Success>
    </Box.Success>
  )
}
