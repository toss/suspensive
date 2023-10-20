import type { Key } from '../Await'
import type { PlainObject } from './isPlainObject'
import { isPlainObject } from './isPlainObject'

export const hashKey = (key: Key) =>
  JSON.stringify(key, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val)
          .sort()
          .reduce((acc: PlainObject, cur) => {
            acc[cur] = val[cur]
            return acc
          }, {})
      : val
  )
