export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

export const assertMessageUseErrorBoundaryOnlyInChildrenOfErrorBoundary =
  'useErrorBoundary: this hook should be called in ErrorBoundary.props.children'
export const assertMessageUseErrorBoundaryFallbackPropsOnlyInFallbackOfErrorBoundary =
  'useErrorBoundary: this hook should be called in ErrorBoundary.props.children'
export const assertMessageUseErrorBoundaryGroupOnlyInChildrenOfErrorBoundaryGroup =
  'useErrorBoundary: this hook should be called in ErrorBoundary.props.children'
