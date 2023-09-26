import { hashKey, isPlainObject } from './hashKey'

const key1 = [
  {
    field1: 'field1',
    field2: 'field2',
  },
]
const key2 = [
  {
    field2: 'field2',
    field1: 'field1',
  },
]

describe('JSON.stringify', () => {
  it("should make different string regardless of key's field order", () => {
    expect(JSON.stringify(key1) === JSON.stringify(key2)).toBe(false)
  })
})

describe('hashKey', () => {
  it("should make same string regardless of key's field order", () => {
    expect(hashKey(key1) === hashKey(key2)).toBe(true)
  })
})

describe('isPlainObject', () => {
  it('should return true for a plain object', () => {
    expect(isPlainObject({})).toBe(true)
  })

  it('should return true for an object without a constructor', () => {
    expect(isPlainObject(Object.create(null))).toBe(true)
  })

  it('should return false for an array', () => {
    expect(isPlainObject([])).toBe(false)
  })

  it('should return false for a null value', () => {
    expect(isPlainObject(null)).toBe(false)
  })

  it('should return false for an undefined value', () => {
    expect(isPlainObject(undefined)).toBe(false)
  })

  it('should return false for an object instance without an Object-specific method', () => {
    class Foo {
      abc: any
      constructor() {
        this.abc = {}
      }
    }
    expect(isPlainObject(new Foo())).toBe(false)
  })

  it('should return false for an object with a custom prototype', () => {
    function Graph(this: any) {
      this.vertices = []
      this.edges = []
    }
    Graph.prototype.addVertex = function (v: any) {
      this.vertices.push(v)
    }
    expect(isPlainObject(Object.create(Graph))).toBe(false)
  })
})
