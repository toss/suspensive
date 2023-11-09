import { useCallback, useState } from 'react'

export const useRefreshKey = (): [number, () => void] => {
  const [key, setKey] = useState(0)
  const refresh = useCallback(() => setKey((prev) => prev + 1), [])

  return [key, refresh]
}
