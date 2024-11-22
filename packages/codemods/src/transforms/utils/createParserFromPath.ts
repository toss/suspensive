import j from 'jscodeshift'
// @ts-expect-error: Declaration files are not included
import babylonParse from 'jscodeshift/parser/babylon'
// @ts-expect-error: Declaration files are not included
import tsOptions from 'jscodeshift/parser/tsOptions'

export function createParserFromPath(filePath: string): j.JSCodeshift {
  const isDeclarationFile = /\.d\.[mc]?ts$/.test(filePath)
  if (isDeclarationFile) {
    return j.withParser(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
      babylonParse({
        ...tsOptions,
        plugins: [
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          ...tsOptions.plugins.filter((plugin: string) => plugin !== 'typescript'),
          ['typescript', { dts: true }],
        ],
      })
    )
  }

  const isTsFile = /\.[mc]?ts$/.test(filePath)
  return isTsFile ? j.withParser('ts') : j.withParser('tsx')
}
