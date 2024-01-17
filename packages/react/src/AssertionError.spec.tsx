import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { AssertionError } from './AssertionError'
import { ErrorBoundary } from '.'

describe('AssertionError.assert', () => {
  it('should make assertion if condition is boolean', () => {
    const isRandomlyTrue = Math.random() > 0.5
    expectTypeOf(isRandomlyTrue).toEqualTypeOf<boolean>()
    try {
      AssertionError.assert(isRandomlyTrue, 'isRandomlyTrue should be true')
      expectTypeOf(isRandomlyTrue).toEqualTypeOf<true>()
      expect(isRandomlyTrue).toBe(true)
    } catch (error) {
      expect(error).toBeInstanceOf(AssertionError)
    }
  })
  it('should make assertion if condition is right', () => {
    const isAlwaysTrue = Math.random() > 0
    expectTypeOf(isAlwaysTrue).toEqualTypeOf<boolean>()
    AssertionError.assert(isAlwaysTrue, 'isAlwaysTrue should be true')
    expectTypeOf(isAlwaysTrue).toEqualTypeOf<true>()
    expect(isAlwaysTrue).toBe(true)
  })
  it('should throw AssertionError if condition is not right', () => {
    try {
      AssertionError.assert(Math.random() > 2, 'Math.random() should be greater than 2')
    } catch (error) {
      expect(error).toBeInstanceOf(AssertionError)
    }
  })

  type Params = { id?: string }
  const useParams = <TParams extends Record<string, string>>(resultParam?: Record<string, string>) =>
    ({
      ...resultParam,
    }) as TParams
  it('should assert condition in TypeScript, JavaScript (assertion blocked case)', () => {
    render(
      <ErrorBoundary shouldCatch={AssertionError} fallback={({ error }) => <>{error.message}</>}>
        {createElement(() => {
          const { id } = useParams<{ id?: string }>()
          expectTypeOf(id).toEqualTypeOf<Params['id']>()
          AssertionError.assert(typeof id === 'string', 'params.id must be string')
          expect(typeof id).toBe('string')
          expectTypeOf(id).toEqualTypeOf<Required<Params>['id']>()
          return <>Try reaching: {id}</>
        })}
      </ErrorBoundary>
    )
    expect(screen.getByText('params.id must be string')).toBeInTheDocument()
  })

  it('should assert condition in TypeScript, JavaScript (assertion passed case)', () => {
    const virtualId = 'virtual-id'
    render(
      <ErrorBoundary shouldCatch={AssertionError} fallback={({ error }) => <>{error.message}</>}>
        {createElement(() => {
          const { id } = useParams<{ id?: string }>({ id: virtualId })
          expectTypeOf(id).toEqualTypeOf<Params['id']>()
          AssertionError.assert(typeof id === 'string', 'params.id must be string')
          expect(typeof id).toBe('string')
          expectTypeOf(id).toEqualTypeOf<Required<Params>['id']>()
          return <>Try reaching: {id}</>
        })}
      </ErrorBoundary>
    )
    expect(screen.getByText(`Try reaching: ${virtualId}`)).toBeInTheDocument()
  })
})
