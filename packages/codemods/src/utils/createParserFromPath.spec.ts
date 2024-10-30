/* eslint-disable @typescript-eslint/unbound-method */
import j from 'jscodeshift'
import { createParserFromPath } from './createParserFromPath'

vi.spyOn(j, 'withParser')

describe('createParserFromPath', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns babylon parser with TypeScript options for declaration files', () => {
    createParserFromPath('example.d.ts')
    expect(j.withParser).toHaveBeenCalledWith(expect.objectContaining({ parse: expect.any(Function) }))

    createParserFromPath('example.d.mts')
    expect(j.withParser).toHaveBeenCalledWith(expect.objectContaining({ parse: expect.any(Function) }))
  })

  it('returns TypeScript parser for regular TypeScript files', () => {
    createParserFromPath('example.ts')
    expect(j.withParser).toHaveBeenCalledWith('ts')

    createParserFromPath('example.mts')
    expect(j.withParser).toHaveBeenCalledWith('ts')
  })

  it('returns TSX parser for non-TypeScript files', () => {
    createParserFromPath('example.tsx')
    expect(j.withParser).toHaveBeenCalledWith('tsx')

    createParserFromPath('example.jsx')
    expect(j.withParser).toHaveBeenCalledWith('tsx')
  })
})
