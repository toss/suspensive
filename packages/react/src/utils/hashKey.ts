import { Key } from '../experimental/Await'
import { PlainObject, isPlainObject } from './isPlainObject'

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
