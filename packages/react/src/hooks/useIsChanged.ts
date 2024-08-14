import { usePrevious } from './usePrevious'

export const useIsChanged = (value: unknown) => usePrevious(value) !== value
