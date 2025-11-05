import { headers, nextComponentType } from '@suspensive/next'
import { queryOptions } from '@tanstack/react-query'

export async function getBaseUrl(): Promise<string> {
  const type = nextComponentType()
  switch (type) {
    case 'React Server Component': {
      if (process.env.INTERNAL_API_ORIGIN) return process.env.INTERNAL_API_ORIGIN
      const nextHeaders = await headers()
      const proto = nextHeaders.get('x-forwarded-proto') ?? 'http'
      const host = nextHeaders.get('x-forwarded-host') ?? nextHeaders.get('host') ?? 'localhost:4100'
      return `${proto}://${host}`
    }
    case 'React Client Component (server)': {
      if (process.env.INTERNAL_API_ORIGIN) return process.env.INTERNAL_API_ORIGIN
      throw new Error('React Client Component (server) is not supported')
    }
    case 'React Client Component (browser)': {
      return process.env.NEXT_PUBLIC_API_ORIGIN ?? window.location.origin
    }
    default: {
      throw new Error(`Unsupported component type: ${type}`)
    }
  }
}

export const query = {
  text: (id: number) =>
    queryOptions({
      queryKey: ['query.text', id],
      queryFn: async () => {
        const baseURL = await getBaseUrl()
        return isoFetch(`${baseURL}/api/text?id=${id}`, {
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
