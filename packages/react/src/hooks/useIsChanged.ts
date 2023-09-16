import { usePrevious } from '.'

export const useIsChanged = (value: unknown) => usePrevious(value) !== value
