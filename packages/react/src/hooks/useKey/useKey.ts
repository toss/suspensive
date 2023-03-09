import { useCallback, useState } from 'react'

const useKey = (): [number, () => void] => {
  const [key, setKey] = useState(0)
  const refresh = useCallback(() => setKey((prev) => prev + 1), [])

  return [key, refresh]
}

export default useKey
