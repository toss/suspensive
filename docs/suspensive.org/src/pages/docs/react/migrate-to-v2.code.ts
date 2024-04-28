export default {
  devMode: `import { useState } from 'react'
import { DevMode, Suspensive, SuspensiveProvider, Suspense, ErrorBoundary } from '@suspensive/react'
  
export default () => {
  const [suspensive] = useState(new Suspensive())
  
  return (
    <SuspensiveProvider value={suspensive}>
      {/* This devMode prop will work only in development mode */}
      <Suspense fallback={<>loading...</>} devMode={{ showFallback: true }}>
        {/* children */}
      </Suspense>
      <ErrorBoundary fallback={<>error</>} devMode={{ showFallback: true }}>
        {/* children */}
      </ErrorBoundary>
      {/* This <DevMode/> component will appear only in development mode */}
      {/* If developer click <DevMode/>, devMode prop of <Suspense/> <ErrorBoundary/> will be activated */}
      <DevMode />
    </SuspensiveProvider>
  )
}`,
  wrap: {
    Example: `import { wrap } from '@suspensive/react'
import { useSuspenseQuery } from '@suspensive/react-query'
import { api } from "./api"
  
export default wrap
    .ErrorBoundaryGroup({ blockOutside: false })
    .ErrorBoundary({ fallback: ({ error }) => <>{error.message}</> })
    .Suspense({ fallback: <>loading...</>, clientOnly: true })
    .on(() => {
      const query = useSuspenseQuery({
        queryKey: ['key'],
        queryFn: () => api.text(),
      })

  return <>{query.data.text}</>
})
`,
    App: `import Example from "./Example"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()
    
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  )
}
`,
  },
  api: `export const api = {
  text: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return { text: 'Hello, Suspensive!' }
  }
}`,
}
