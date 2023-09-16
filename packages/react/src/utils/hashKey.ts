import { Key } from '../experimental/Await'

export const hashKey = (key: Key) => {
  return JSON.stringify(key, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val)
          .sort()
          .reduce((result, key) => {
            result[key] = val[key]
            return result
          }, {} as any)
      : val
  )
}

// eslint-disable-next-line @typescript-eslint/ban-types
const isPlainObject = (o: any): o is Object => {
  if (!hasObjectPrototype(o)) {
    return false
  }

  // If has modified constructor
  const ctor = o.constructor
  if (typeof ctor === 'undefined') {
    return true
  }

  // If has modified prototype
  const prot = ctor.prototype
  if (!hasObjectPrototype(prot)) {
    return false
  }

  // If constructor does not have an Object-specific method
  // eslint-disable-next-line no-prototype-builtins
  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false
  }

  // Most likely a plain Object
  return true
}

const hasObjectPrototype = (o: any) => Object.prototype.toString.call(o) === '[object Object]'
