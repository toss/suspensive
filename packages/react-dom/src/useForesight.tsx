import { useCallback, useEffect, useRef } from 'react'
import {
  ForesightManager,
  type ForesightRegisterOptionsWithoutElement,
  type ForesightRegisterResult,
} from 'js.foresight'

export interface UseForesightOptions extends ForesightRegisterOptionsWithoutElement {
  /** Whether to initialize ForesightManager automatically if not already initialized */
  autoInitialize?: boolean
  /** Whether to disable foresight tracking (useful for conditional usage) */
  disabled?: boolean
}

export interface UseForesightResult {
  /** Ref to attach to the target element */
  ref: (element: Element | null) => void
  /** Information about the registration result */
  registerResult: ForesightRegisterResult | null
  /** Whether the element is currently registered with ForesightManager */
  isRegistered: boolean
}

/**
 * React hook for integrating with js.foresight to predict user interactions
 * based on mouse trajectory, keyboard navigation, and scroll behavior.
 *
 * This enables proactive prefetching and UI optimization before users interact with elements.
 *
 * @experimental This is experimental feature.
 * @see {@link https://foresightjs.com/docs/integrations/react/useForesight ForesightJS React Documentation}
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { ref } = useForesight({
 *     callback: () => {
 *       // Prefetch data or prepare UI before user actually clicks
 *       console.log('User is likely to interact with this element!')
 *     },
 *     name: 'my-interactive-element',
 *     hitSlop: 10, // Add extra detection area around element
 *   })
 *
 *   return (
 *     <button ref={ref}>
 *       Click me
 *     </button>
 *   )
 * }
 * ```
 */
export function useForesight({
  callback,
  hitSlop,
  name,
  meta,
  reactivateAfter,
  autoInitialize = true,
  disabled = false,
}: UseForesightOptions): UseForesightResult {
  const elementRef = useRef<Element | null>(null)
  const registerResultRef = useRef<ForesightRegisterResult | null>(null)
  const isRegisteredRef = useRef(false)

  // Initialize ForesightManager if needed
  useEffect(() => {
    if (disabled || !autoInitialize) return

    if (!ForesightManager.isInitiated) {
      ForesightManager.initialize()
    }
  }, [autoInitialize, disabled])

  // Register/unregister element when it changes or options change
  useEffect(() => {
    if (disabled || !elementRef.current) {
      // Unregister if disabled or no element
      if (isRegisteredRef.current && elementRef.current) {
        ForesightManager.instance?.unregister(elementRef.current, 'apiCall')
        isRegisteredRef.current = false
        registerResultRef.current = null
      }
      return
    }

    // Initialize if not already done
    if (!ForesightManager.isInitiated) {
      if (autoInitialize) {
        ForesightManager.initialize()
      } else {
        return // Don't register if manager is not initialized and auto-init is disabled
      }
    }

    // Register the element
    const result = ForesightManager.instance.register({
      element: elementRef.current,
      callback,
      hitSlop,
      name,
      meta,
      reactivateAfter,
    })

    registerResultRef.current = result
    isRegisteredRef.current = result.isRegistered

    return () => {
      if (elementRef.current && isRegisteredRef.current) {
        ForesightManager.instance?.unregister(elementRef.current, 'apiCall')
        isRegisteredRef.current = false
        registerResultRef.current = null
      }
    }
  }, [callback, hitSlop, name, meta, reactivateAfter, disabled, autoInitialize])

  const ref = useCallback(
    (element: Element | null) => {
      // Unregister previous element if it exists
      if (elementRef.current && isRegisteredRef.current) {
        ForesightManager.instance?.unregister(elementRef.current, 'apiCall')
        isRegisteredRef.current = false
        registerResultRef.current = null
      }

      elementRef.current = element

      if (!disabled && element) {
        // Initialize if needed
        if (!ForesightManager.isInitiated) {
          if (autoInitialize) {
            ForesightManager.initialize()
          } else {
            return
          }
        }

        // Register new element
        const result = ForesightManager.instance.register({
          element,
          callback,
          hitSlop,
          name,
          meta,
          reactivateAfter,
        })

        registerResultRef.current = result
        isRegisteredRef.current = result.isRegistered
      }
    },
    [callback, hitSlop, name, meta, reactivateAfter, disabled, autoInitialize]
  )

  return {
    ref,
    registerResult: registerResultRef.current,
    isRegistered: isRegisteredRef.current,
  }
}
