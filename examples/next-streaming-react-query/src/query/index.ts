import { headers, nextComponentType } from '@suspensive/next'
import { queryOptions } from '@tanstack/react-query'

const baseURL = (() => {
  if (typeof window !== 'undefined') return ''
  if (process.env.NEXT_PUBLIC_STREAMING_HTML_URL) return `https://${process.env.NEXT_PUBLIC_STREAMING_HTML_URL}`
  return 'http://localhost:4100'
})()

export const query = {
  text: (ms: number) =>
    queryOptions({
      queryKey: ['query.text', ms],
      queryFn: () => {
        return isoFetch(`${baseURL}/api/text?wait=${ms}`, {
          cache: 'no-store',
        }).then((res) => res.json()) as unknown as Promise<string>
      },
    }),
}

const isoFetch: typeof fetch = async (input: string | URL | Request, init?: RequestInit) => {
  const type = nextComponentType()
  switch (type) {
    case 'React Client Component (server)': {
      // console.log(`${type}:`, { input, init })
      await delay(1000).then(() => Promise.reject(new Error(`isoFetch: ${type} ${JSON.stringify({ input, init })}`)))
      return fetch(input, init)
    }
    case 'React Client Component (browser)': {
      // console.log(`${type}:`, { input, init })
      return fetch(input, init)
    }
    case 'React Server Component': {
      const nextHeaders = await headers()
      // await delay(1000).then(() => Promise.reject(new Error(`isoFetch: ${type} ${JSON.stringify({ input, init })}`)))

      console.log(`${type}:`, { date: new Date().toISOString(), error: false })
      const mergedHeaders = new Headers(init?.headers)
      nextHeaders.forEach((value, key) => mergedHeaders.set(key, value))
      return fetch(input, { ...init, headers: mergedHeaders })
    }
  }
  return fetch(input, init)
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
