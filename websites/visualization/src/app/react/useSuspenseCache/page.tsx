'use client'

import { ErrorBoundary, ErrorBoundaryGroup, Suspense, suspenseCache, useSuspenseCache } from '@suspensive/react'
import { ComponentProps } from 'react'
import { Area, Box, Button } from '~/components/uis'
import { api } from '~/utils/api'

const useManualCache = (manualOption = { successPercentage: 50, waitMs: 500 }) =>
  useSuspenseCache({
    key: ['manual', manualOption],
    fn: () => api.manual(manualOption),
  } as const)

const ManualCacheUser1 = () => {
  const manualCache = useManualCache()

  return (
    <Box.Success>
      <Button onClick={manualCache.reset}>↻</Button>
      {manualCache.data}
    </Box.Success>
  )
}
const ManualCacheUser2 = () => {
  const manualCache = useManualCache()

  return (
    <Box.Success>
      <Button onClick={manualCache.reset}>↻</Button>
      {manualCache.data}
    </Box.Success>
  )
}
const CustomCacheUser = () => {
  const customCache = useSuspenseCache({
    key: ['custom'],
    fn: () => api.manual({ successPercentage: 50, waitMs: 500 }),
  } as const)

  return (
    <Box.Success>
      <Button onClick={customCache.reset}>↻</Button>
      {customCache.data}
    </Box.Success>
  )
}

const BoundaryPage = () => (
  <Area title="ErrorBoundaryGroup">
    <ErrorBoundaryGroup>
      <ErrorBoundaryGroup.Reset
        trigger={(group) => (
          <Button
            onClick={() => {
              group.reset()
              suspenseCache.reset()
            }}
          >
            ↻
          </Button>
        )}
      />
      <Area title="useSuspenseCache: ManualCacheUser1">
        <ErrorBoundary fallback={ErrorBoundaryFallback}>
          <Suspense.CSROnly>
            <ManualCacheUser1 />
          </Suspense.CSROnly>
        </ErrorBoundary>
      </Area>
      <Area title="useSuspenseCache: ManualCacheUser2">
        <ErrorBoundary fallback={ErrorBoundaryFallback}>
          <Suspense.CSROnly>
            <ManualCacheUser2 />
          </Suspense.CSROnly>
        </ErrorBoundary>
      </Area>
      <Area title="useSuspenseCache: CustomCacheUser">
        <ErrorBoundary fallback={ErrorBoundaryFallback}>
          <Suspense.CSROnly>
            <CustomCacheUser />
          </Suspense.CSROnly>
        </ErrorBoundary>
      </Area>
    </ErrorBoundaryGroup>
  </Area>
)

const ErrorBoundaryFallback: ComponentProps<typeof ErrorBoundary>['fallback'] = (caught) => (
  <Box.Error>
    <ErrorBoundaryGroup.Reset trigger={(group) => <Button onClick={group.reset}>↻</Button>} />
    {caught.error.message}
  </Box.Error>
)

export default BoundaryPage
