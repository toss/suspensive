import { hashKey } from './hashKey'
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
