export const baseTemplate = {
  files: {
    '/hideReactErrorOverlay.css': {
      code: `body > iframe {
  display: none;
}`,
      hidden: true,
    },
    '/App.tsx': {
      code: `import { Example } from './Example'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './hideReactErrorOverlay.css'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  )
}`,
      hidden: true,
    },
  },
  dependencies: {
    '@tanstack/react-query': '^4',
    '@suspensive/react': '^3.0.0-next',
    '@suspensive/react-dom': '^3.0.0-next',
    '@suspensive/react-query': '^3.0.0-next',
  },
  devDependencies: {},
}
