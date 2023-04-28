import { useSuspenseQuery } from '@suspensive/react-query'
import { Box, Description } from './uis'

type Props = {
  queryKey: Readonly<['query' | 'boundary', number]>
  queryFn: () => Promise<string>
}

export const UseSuspenseQuery = ({ queryKey, queryFn }: Props) => {
  const query = useSuspenseQuery({
    queryKey,
    queryFn,
  })

  return (
    <Box.Success>
      <Description.Success>{query.data}</Description.Success>
    </Box.Success>
  )
}
