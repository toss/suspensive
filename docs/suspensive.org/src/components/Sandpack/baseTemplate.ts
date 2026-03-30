export const baseTemplate = {
  files: {
    '/hideReactErrorOverlay.css': {
      code: `body > iframe {
  display: none;
}
body {
  background: #0a0a0a;
  color: #e5e5e5;
  font-family: system-ui, sans-serif;
  margin: 0;
}
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 2px; }
* { scrollbar-width: thin; scrollbar-color: rgba(128,128,128,0.3) transparent; }`,
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
    '@suspensive/react': '^3',
    '@suspensive/react-query': '^3',
  },
  devDependencies: {},
}
