import { beforeAll, expect, test, vi } from 'vitest'
import { mockAllIsIntersecting } from './__tests__/test-utils'

vi.hoisted(() => {
  // Clear the `beforeEach` from global, so we can detect if this is a test env
  // @ts-expect-error Property 'vi' does not exist on type 'typeof globalThis'.
  global.vi = undefined
})

beforeAll(() => {})

test('should warn if not running in test env', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  mockAllIsIntersecting(true)
  expect(console.error).toHaveBeenCalledWith(`React Intersection Observer was not configured to handle mocking.
Outside Jest and Vitest, you might need to manually configure it by calling setupIntersectionMocking() and resetIntersectionMocking() in your test setup file.

// test-setup.js
import { resetIntersectionMocking, setupIntersectionMocking } from 'react-intersection-observer/test-utils';

beforeEach(() => {
  setupIntersectionMocking(vi.fn);
});

afterEach(() => {
  resetIntersectionMocking();
});`)
})
