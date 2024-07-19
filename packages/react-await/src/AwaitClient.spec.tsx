import { ERROR_MESSAGE, FALLBACK, TEXT, sleep } from '@suspensive/utils'
import { render, screen, waitFor } from '@testing-library/react'
import ms from 'ms'
import { Suspense } from 'react'
import { Await } from './Await'
import { awaitClient } from './AwaitClient'
import { hashKey } from './utils'

const key = (id: number) => ['key', id] as const

// eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
const asyncErrorFn = () => new Promise((_, reject) => reject(ERROR_MESSAGE))
describe('awaitClient', () => {
  beforeEach(() => awaitClient.reset())

  it("have clearError method without key should clear promise & error for all key's awaitState", async () => {
    expect(awaitClient.getError(key(1))).toBeUndefined()
    expect(awaitClient.getError(key(2))).toBeUndefined()
    try {
      awaitClient.suspend({ key: key(1), fn: asyncErrorFn })
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      awaitClient.suspend({ key: key(1), fn: asyncErrorFn })
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    try {
      awaitClient.suspend({ key: key(2), fn: asyncErrorFn })
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      awaitClient.suspend({ key: key(2), fn: asyncErrorFn })
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    expect(awaitClient.getError(key(1))).toBe(ERROR_MESSAGE)
    expect(awaitClient.getError(key(2))).toBe(ERROR_MESSAGE)

    awaitClient.clearError()
    expect(awaitClient.getError(key(1))).toBeUndefined()
    expect(awaitClient.getError(key(2))).toBeUndefined()
  })

  it("have clearError method with key should clear promise & error for key's awaitState", async () => {
    expect(awaitClient.getError(key(1))).toBeUndefined()
    expect(awaitClient.getError(key(2))).toBeUndefined()
    try {
      awaitClient.suspend({ key: key(1), fn: asyncErrorFn })
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      awaitClient.suspend({ key: key(1), fn: asyncErrorFn })
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    try {
      awaitClient.suspend({ key: key(2), fn: asyncErrorFn })
    } catch (promiseToSuspense) {
      expect(await promiseToSuspense).toBeUndefined()
    }
    try {
      awaitClient.suspend({ key: key(2), fn: asyncErrorFn })
    } catch (error) {
      expect(error).toBe(ERROR_MESSAGE)
    }
    expect(awaitClient.getError(key(1))).toBe(ERROR_MESSAGE)
    expect(awaitClient.getError(key(2))).toBe(ERROR_MESSAGE)

    awaitClient.clearError(key(1))
    expect(awaitClient.getError(key(1))).toBeUndefined()
    expect(awaitClient.getError(key(2))).toBe(ERROR_MESSAGE)
    awaitClient.clearError(key(2))
    expect(awaitClient.getError(key(1))).toBeUndefined()
    expect(awaitClient.getError(key(2))).toBeUndefined()
  })

  it("have getData method with key should get data of key's awaitState", async () => {
    render(
      <Suspense fallback={FALLBACK}>
        <Await options={{ key: key(1), fn: () => sleep(ms('0.1s')).then(() => TEXT) }}>
          {(awaited) => <>{awaited.data}</>}
        </Await>
      </Suspense>
    )

    expect(screen.queryByText(FALLBACK)).toBeInTheDocument()
    expect(screen.queryByText(TEXT)).not.toBeInTheDocument()
    expect(awaitClient.getData(key(1))).toBeUndefined()
    await waitFor(() => expect(screen.queryByText(TEXT)).toBeInTheDocument())
    expect(screen.queryByText(FALLBACK)).not.toBeInTheDocument()
    expect(awaitClient.getData(key(1))).toBe(TEXT)
  })

  it('should handle unsubscribe gracefully when no subscribers exist', () => {
    const mockSync = vi.fn()
    const key = ['nonexistent', 'key'] as const
    awaitClient.unsubscribe(key, mockSync)

    expect(awaitClient['syncsMap'].get(hashKey(key))).toBeUndefined()
  })
})
