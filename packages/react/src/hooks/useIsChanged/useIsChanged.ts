import { usePrevious } from '../usePrevious'

const useIsChanged = (value: unknown) => usePrevious(value) !== value

export default useIsChanged
