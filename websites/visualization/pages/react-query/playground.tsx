import { Suspense } from '@suspensive/react'
import { PostListTanStack, PostListSuspensive } from '../../components/forPlayground'

const Page = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <h1>Compare codes to use each libraries</h1>
    <div style={{ display: 'flex', gap: 16, justifyContent: 'space-around', width: '100vw' }}>
      <section>
        <a
          href="https://github.com/suspensive/react/tree/main/websites/visualization/components/forPlayground/tanstack.tsx"
          style={{ color: '#61DAFB' }}
          target="_blank"
          rel="noreferrer"
        >
          <h1>🔗 See code for @tanstack/react-query</h1>
        </a>
        <PostListTanStack />
      </section>
      <section>
        <a
          href="https://github.com/suspensive/react/tree/main/websites/visualization/components/forPlayground/suspensive.tsx"
          style={{ color: '#61DAFB' }}
          target="_blank"
          rel="noreferrer"
        >
          <h1>🔗 See code for @suspensive/react-query</h1>
        </a>
        <Suspense.CSROnly>
          <PostListSuspensive />
        </Suspense.CSROnly>
      </section>
    </div>
  </div>
)

export default Page
