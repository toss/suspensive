import { type UseForesightOptions, type UseForesightResult, useForesight } from './useForesight'

interface ForesightProps extends UseForesightOptions {
  children: (foresightResult: UseForesightResult) => React.ReactNode
}

/**
 * React component for integrating with js.foresight to predict user interactions
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
 *   return (
 *     <Foresight
 *       callback={() => {
 *         // Prefetch data or prepare UI before user actually interacts
 *         console.log('User is likely to interact with this element!')
 *       }}
 *       name="my-interactive-element"
 *       hitSlop={10}
 *     >
 *       {({ ref, isRegistered }) => (
 *         <button ref={ref} data-registered={isRegistered}>
 *           Click me
 *         </button>
 *       )}
 *     </Foresight>
 *   )
 * }
 * ```
 */
export function Foresight({ children, ...options }: ForesightProps) {
  return <>{children(useForesight(options))}</>
}
