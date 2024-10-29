import j from 'jscodeshift'
// @ts-expect-error: Declaration files are not included
import babylonParse from 'jscodeshift/parser/babylon'
// @ts-expect-error: Declaration files are not included
import tsOptions from 'jscodeshift/parser/tsOptions'

export const jscodeshiftExecutable = require.resolve('.bin/jscodeshift')

export function onCancel() {
  process.exit(1)
}

export function createParserFromPath(filePath: string): j.JSCodeshift {
  const isDeclarationFile = /\.d\.(m|c)?ts$/.test(filePath)
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

  // jsx is allowed in .js files, feed them into the tsx parser.
  // tsx parser :.js, .jsx, .tsx
  // ts parser: .ts, .mts, .cts
  const isTsFile = /\.(m|c)?.ts$/.test(filePath)
  return isTsFile ? j.withParser('ts') : j.withParser('tsx')
}
