import { Suspense, ErrorBoundary } from '@suspensive/react-boundary'
import UseQueryWithSuspense from '../components/UseQueryWithSuspense'
import { ErrorAfter4s } from '../components/ErrorAfter4s'
import { useCallback, useState } from 'react'
import { ResetSuspenseQueryBoundary } from '../libs/react-suspense-query'
import dynamic from 'next/dynamic'

const DynamicUseQueryWithSuspense = dynamic(
  () => import('../components/UseQueryWithSuspense')
)

const Home = () => {
  const { reset: resetBoundary, resetKey: resetBoundaryKey } = useResetKey()
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '90vh',
        margin: 16,
        alignItems: 'center',
        border: '1px solid white',
      }}
    >
      <span style={{ position: 'absolute', left: 4, top: 4 }}>ResetBoundary</span>
      <button onClick={resetBoundary}>Reset All</button>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'start',
          flex: 1,
          flexDirection: 'column',
        }}
      >
        <h1>Suspense</h1>
        check index.html in Network tab of Devtools(Cmd + Opt + I)
        <h3>default Suspense</h3>
        <Suspense fallback={<>loading...</>}>
          <DynamicUseQueryWithSuspense
            queryKey={['async', 'alwaysSuccess', 'Both']}
            axiosLikeFn={getAxiosLike({ successPercentage: 100 })}
          />
        </Suspense>
        <h3>Suspense.CSROnly (Reveal after 2s)</h3>
        <Suspense.CSROnly fallback={<>loading...</>}>
          <UseQueryWithSuspense
            queryKey={['async', 'alwaysSuccess', 'CSROnly']}
            axiosLikeFn={getAxiosLike({ successPercentage: 100 })}
          />
        </Suspense.CSROnly>
        <h1>ErrorBoundary (Error after 2s)</h1>
        <ErrorBoundary
          resetKeys={[resetBoundaryKey]}
          fallback={({ error, reset }) => (
            <button onClick={reset}>{JSON.stringify(error)}</button>
          )}
        >
          <ErrorAfter4s />
        </ErrorBoundary>
        <h1>ResetSuspenseQueryBoundary (70% Error)</h1>
        <ResetSuspenseQueryBoundary.CSROnly
          resetKeys={[resetBoundaryKey]}
          pendingFallback={<>AsyncBoundary Loading...</>}
          rejectedFallback={({ error, reset }) => (
            <button onClick={reset}> {JSON.stringify(error)} error...</button>
          )}
        >
          <UseQueryWithSuspense
            queryKey={['async', 'almostFailure']}
            axiosLikeFn={getAxiosLike({ successPercentage: 30 })}
          />
        </ResetSuspenseQueryBoundary.CSROnly>
      </div>
    </div>
  )
}

export default Home

const getAxiosLike =
  (option: { waitMs?: number; successPercentage: number }) => async () => {
    const { waitMs = 2000, successPercentage } = option

    const isSuccess = Math.random() < successPercentage / 100

    wait(waitMs)

    if (!isSuccess) {
      throw { status: 401, message: 'unauthorized' }
    }

    return { data: 'success in queryFn' }
  }

const wait = (ms: number) => {
  let start = Date.now(),
    now = start
  while (now - start < ms) {
    now = Date.now()
  }
}

const useResetKey = () => {
  const [resetKey, setResetKey] = useState({})
  const reset = useCallback(() => setResetKey(prev => ({ ...prev })), [])

  return { resetKey, reset }
}
