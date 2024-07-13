export type PlainObject = Record<string, any>

export const isPlainObject = (value: any): value is PlainObject => {
  if (!hasObjectPrototype(value)) {
    return false
  }

  // If has modified constructor
  const ctor = value.constructor
  if (typeof ctor === 'undefined') {
    return true
  }

  // If has modified prototype
  const prot = ctor.prototype
  if (!hasObjectPrototype(prot)) {
    return false
  }

  // If constructor does not have an Object-specific method
  if (!Object.prototype.hasOwnProperty.call(prot, 'isPrototypeOf')) {
    return false
  }

  // Most likely a plain Object
  return true
}

const hasObjectPrototype = (value: any) => Object.prototype.toString.call(value) === '[object Object]'
