export const sum = (a: number, b: number) => a + b

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
