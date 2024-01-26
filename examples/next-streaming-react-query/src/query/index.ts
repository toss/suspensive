import { queryOptions } from '@tanstack/react-query'

const baseURL = (() => {
  if (typeof window !== 'undefined') return ''
  if (process.env.NEXT_PUBLIC_STREAMING_HTML_URL) return `https://${process.env.NEXT_PUBLIC_STREAMING_HTML_URL}`
  return 'http://localhost:4100'
})()

export const query = {
  text: <TMs extends number>(ms: TMs) =>
    queryOptions({
      queryKey: ['query.text', ms],
      queryFn: () =>
        fetch(`${baseURL}/api/text?wait=${ms}`, {
          cache: 'no-store',
        }).then(
          (res) =>
            res.json() as unknown as `${ReturnType<Date['toISOString']>} success to get text waited after ${TMs}ms`
        ),
    }),
}
