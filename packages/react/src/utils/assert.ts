export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

export const useErrorBoundary_this_hook_should_be_called_in_ErrorBoundary_props_children =
  'useErrorBoundary: this hook should be called in ErrorBoundary.props.children'

export const useErrorBoundaryFallbackProps_this_hook_should_be_called_in_ErrorBoundary_props_fallback =
  'useErrorBoundaryFallbackProps: this hook should be called in ErrorBoundary.props.fallback'

export const useErrorBoundaryGroup_this_hook_should_be_called_in_ErrorBoundary_props_children =
  'useErrorBoundaryGroup: this hook should be called in ErrorBoundary.props.children'
