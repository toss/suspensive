export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

assert.message = {
  useErrorBoundary: {
    onlyInChildrenOfErrorBoundary: 'useErrorBoundary: this hook should be called in ErrorBoundary.props.children',
  },
  useErrorBoundaryGroup: {
    onlyInChildrenOfErrorBoundaryGroup:
      'useErrorBoundaryGroup: this hook should be called in ErrorBoundaryGroup.props.children',
  },
} as const
