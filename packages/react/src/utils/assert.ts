export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

// useErrorBoundary
export const useErrorBoundaryOnlyInChildrenOfErrorBoundary =
  'useErrorBoundary: this hook should be called in ErrorBoundary.props.children'
export const useErrorBoundaryFallbackPropsOnlyInFallbackOfErrorBoundary =
  'useErrorBoundary: this hook should be called in ErrorBoundary.props.children'
export const useErrorBoundaryGroupOnlyInChildrenOfErrorBoundaryGroup =
  'useErrorBoundary: this hook should be called in ErrorBoundary.props.children'

// Delay
export const DelayMsPropShouldBeGreaterThanOrEqualTo0 = 'Delay: ms prop should be greater than or equal to 0'

// Suspensive
export const SuspensiveConfigDefaultOptionsDelayMsShouldBeGreaterThan0 =
  'Suspensive: config.defaultOptions.delay.ms should be greater than 0'
