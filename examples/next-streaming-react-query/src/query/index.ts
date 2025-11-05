import { headers, nextComponentType } from '@suspensive/next'
import { queryOptions } from '@tanstack/react-query'

export const query = {
  text: (id: number) =>
    queryOptions({
      queryKey: ['query.text', id],
      queryFn: async () => {
        return isoFetch(`/api/text?id=${id}`, {
          cache: 'no-store',
        }).then((res) => res.json()) as unknown as Promise<string>
      },
    }),
}

const isoFetch = async (input: string, init?: RequestInit) => {
  const type = nextComponentType()
  switch (type) {
    case 'React Client Component (server)': {
      // console.log(`${type}:`, { input, init })
      await delay(1000).then(() => Promise.reject(new Error(`isoFetch: ${type} ${JSON.stringify({ input, init })}`)))
      throw new Error('React Client Component (server) is not supported')
      if (process.env.INTERNAL_API_ORIGIN) {
        const baseUrl = process.env.INTERNAL_API_ORIGIN
        return fetch(`${baseUrl}${input}`, init)
      }
    }
    case 'React Client Component (browser)': {
      // console.log(`${type}:`, { input, init })
      const baseUrl = window.location.origin
      return fetch(`${baseUrl}${input}`, init)
    }
    case 'React Server Component': {
      const nextHeaders = await headers()
      // await delay(1000).then(() => Promise.reject(new Error(`isoFetch: ${type} ${JSON.stringify({ input, init })}`)))
      console.log(`${type}:`, { date: new Date().toISOString(), error: false })
      const mergedHeaders = new Headers(init?.headers)
      nextHeaders.forEach((value, key) => mergedHeaders.set(key, value))
      const baseUrl = (() => {
        if (process.env.INTERNAL_API_ORIGIN) return process.env.INTERNAL_API_ORIGIN
        const proto = mergedHeaders.get('x-forwarded-proto') ?? 'http'
        const host = mergedHeaders.get('x-forwarded-host') ?? mergedHeaders.get('host') ?? 'localhost:4100'
        return `${proto}://${host}`
      })()
      return fetch(`${baseUrl}${input}`, { ...init, headers: mergedHeaders })
    }
  }
  return fetch(input, init)
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
