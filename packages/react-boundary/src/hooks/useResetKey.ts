import { useCallback, useState } from 'react'

const useResetKey = () => {
  const [resetKey, setResetKey] = useState({})
  const reset = useCallback(() => setResetKey(prev => ({ ...prev })), [])

  return { resetKey, reset }
}

export default useResetKey
