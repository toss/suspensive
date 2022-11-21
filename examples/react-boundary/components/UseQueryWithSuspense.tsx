import { useQuery } from '@tanstack/react-query'

type Props = {
  queryKey: unknown[]
  axiosLikeFn: () => Promise<{ data: unknown }>
}

const UseQueryWithSuspense = ({ queryKey, axiosLikeFn }: Props) => {
  const query = useQuery(
    queryKey,
    async () => {
      const { data } = await axiosLikeFn()

      return data
    },
    { suspense: true }
  )

  if (query.isSuccess) {
    return <>{query.data}</>
  }

  return null
}

export default UseQueryWithSuspense
