import { queryOptions } from '@tanstack/react-query'
import axios from 'axios'

const baseURL = (() => {
  if (typeof window !== 'undefined') return ''
  if (process.env.NEXT_PUBLIC_STREAMING_HTML_URL) return `https://${process.env.NEXT_PUBLIC_STREAMING_HTML_URL}`
  return 'http://localhost:4100'
})()

const http = axios.create({ baseURL })

export const query = {
  text: <TMs extends number>(ms: TMs) =>
    queryOptions({
      queryKey: ['query.text', ms],
      queryFn: () =>
        http
          .get<`${ReturnType<Date['toISOString']>} success to get text waited after ${TMs}ms`>(`/api/text?wait=${ms}`)
          .then(({ data }) => data),
    }),
}
