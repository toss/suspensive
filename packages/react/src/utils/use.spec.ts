import { describe, expect, it } from 'vitest'
import { noop } from './noop'
import { use } from './use'

type Usable<T> = PromiseLike<T> & {
  status?: 'pending' | 'fulfilled' | 'rejected'
  value?: T
  reason?: unknown
}

describe('use', () => {
  describe('fulfilled status', () => {
    it('should return value when status is fulfilled', () => {
      const usable: Usable<string> = {
        status: 'fulfilled' as const,
        value: 'test-value',
        then: (onfulfilled) => {
          return Promise.resolve('test-value').then(onfulfilled)
        },
      }

      expect(use(usable)).toBe('test-value')
    })

    it('should return value when status is fulfilled with number', () => {
      const usable: Usable<number> = {
        status: 'fulfilled' as const,
        value: 42,
        then: (onfulfilled) => {
          return Promise.resolve(42).then(onfulfilled)
        },
      }

      expect(use(usable)).toBe(42)
    })

    it('should return value when status is fulfilled with object', () => {
      const usable: Usable<{ key: string }> = {
        status: 'fulfilled' as const,
        value: { key: 'value' },
        then: (onfulfilled) => {
          return Promise.resolve({ key: 'value' }).then(onfulfilled)
        },
      }

      expect(use(usable)).toEqual({ key: 'value' })
    })
  })

  describe('rejected status', () => {
    it('should throw reason when status is rejected', () => {
      const error = new Error('test error')
      const usable: Usable<unknown> = {
        status: 'rejected' as const,
        reason: error,
        then: (_, onrejected) => {
          return Promise.reject(error).catch(onrejected)
        },
      }

      expect(() => use(usable)).toThrow(error)
    })

    it('should throw reason when status is rejected with string', () => {
      const error = new Error('error message')
      const usable: Usable<unknown> = {
        status: 'rejected' as const,
        reason: 'error message',
        then: (_, onrejected) => {
          return Promise.reject(error).catch(onrejected)
        },
      }

      expect(() => use(usable)).toThrow('error message')
    })
  })

  describe('pending status', () => {
    it('should throw usable when status is pending', () => {
      const usable: Usable<unknown> = {
        status: 'pending' as const,
        then: (onfulfilled) => {
          return Promise.resolve(undefined).then(onfulfilled)
        },
      }

      let thrown: unknown
      try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        use(usable)
        expect.fail('should throw')
      } catch (error_) {
        thrown = error_
      }
      expect(thrown).toBe(usable)
    })
  })

  describe('no status (initial state)', () => {
    it('should set status to pending and throw usable when status is undefined', () => {
      const usable = {
        then: (onfulfilled?: (value: string) => void) => {
          void Promise.resolve().then(() => {
            if (onfulfilled) {
              onfulfilled('resolved value')
            }
          })
          return Promise.resolve('resolved value')
        },
      } as Usable<string>

      let thrown: unknown
      try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        use(usable)
        expect.fail('should throw')
      } catch (error_) {
        thrown = error_
      }
      expect(thrown).toBe(usable)
      expect(usable.status).toBe('pending')
    })

    it('should set status to fulfilled and value when promise resolves', async () => {
      let resolvePromise!: (value: string) => void
      const promise = new Promise<string>((resolve) => {
        resolvePromise = resolve
      })

      const usable = {
        then: (onfulfilled?: (value: string) => void) => {
          promise.then((value) => {
            if (onfulfilled) {
              onfulfilled(value)
            }
          })
          return promise
        },
      } as Usable<string>

      let thrown: unknown
      try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        use(usable)
        expect.fail('should throw')
      } catch (error_) {
        thrown = error_
      }
      expect(thrown).toBe(usable)
      expect(usable.status).toBe('pending')

      resolvePromise('resolved value')
      await promise

      expect(usable.status).toBe('fulfilled')
      expect(usable.value).toBe('resolved value')
    })

    it('should set status to rejected and reason when promise rejects', async () => {
      let rejectPromise!: (error: Error) => void
      const promise = new Promise<string>((_, reject) => {
        rejectPromise = reject
      })

      const error = new Error('rejected error')
      const usable = {
        then: (_onfulfilled?: (value: string) => void, onrejected?: (reason: unknown) => void) => {
          promise.catch((err: unknown) => {
            if (onrejected) {
              onrejected(err)
            }
          })
          return promise
        },
      } as Usable<string>

      let thrown: unknown
      try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        use(usable)
        expect.fail('should throw')
      } catch (error_) {
        thrown = error_
      }
      expect(thrown).toBe(usable)
      expect(usable.status).toBe('pending')

      rejectPromise(error)
      await promise.catch(noop)

      expect(usable.status).toBe('rejected')
      expect(usable.reason).toBe(error)
    })
  })
})
