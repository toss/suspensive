import { useSuspenseQuery } from '@suspensive/react-query'
import { Box } from './uis'

type Props = {
  queryKey: unknown[]
  axiosLikeFn: () => Promise<{ data: string }>
}

export const ComponentWithUseSuspenseQuery = ({ queryKey, axiosLikeFn }: Props) => {
  const query = useSuspenseQuery(queryKey, () => axiosLikeFn().then(({ data }) => data))

  return <Box.Success>{query.data}</Box.Success>
}
