export class SuspensiveError extends Error {
  static assert(condition: boolean, message: string): asserts condition {
    if (!condition) {
      throw new SuspensiveError(message)
    }
  }
}

export const Message_useErrorBoundary_this_hook_should_be_called_in_ErrorBoundary_props_children =
  'useErrorBoundary: this hook should be called in ErrorBoundary.props.children'

export const Message_useErrorBoundaryFallbackProps_this_hook_should_be_called_in_ErrorBoundary_props_fallback =
  'useErrorBoundaryFallbackProps: this hook should be called in ErrorBoundary.props.fallback'

export const Message_useErrorBoundaryGroup_this_hook_should_be_called_in_ErrorBoundary_props_children =
  'useErrorBoundaryGroup: this hook should be called in ErrorBoundary.props.children'

export const Message_Delay_ms_prop_should_be_greater_than_or_equal_to_0 =
  'Delay: ms prop should be greater than or equal to 0'

export const Message_DefaultProp_delay_ms_should_be_greater_than_0 = 'DefaultProps: delay.ms should be greater than 0'
