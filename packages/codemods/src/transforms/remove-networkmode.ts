import type { FileInfo } from 'jscodeshift'
import { createParserFromPath } from './utils/createParserFromPath'

const TARGET_FUNCTIONS = new Set([
  'queryOptions',
  'infiniteQueryOptions',
  'useSuspenseQuery',
  'useSuspenseInfiniteQuery',
  'SuspenseQuery',
  'SuspenseInfiniteQuery',
])

export default function transform(file: FileInfo) {
  const j = createParserFromPath(file.path)
  const root = j(file.source)

  root
    .find(j.CallExpression, {
      callee: {
        type: 'Identifier',
      },
    })
    .forEach((path) => {
      if (path.node.callee.type !== 'Identifier') {
        return
      }
      const calleeName = path.node.callee.name
      if (!TARGET_FUNCTIONS.has(calleeName)) {
        return
      }

      const args = path.node.arguments
      if (args.length === 0) {
        return
      }

      const firstArg = args[0]
      if (firstArg.type !== 'ObjectExpression') {
        return
      }

      const properties = firstArg.properties
      const networkModeIndex = properties.findIndex((prop) => {
        if (prop.type === 'ObjectProperty' && prop.key.type === 'Identifier' && prop.key.name === 'networkMode') {
          if (prop.value.type === 'StringLiteral' && prop.value.value === 'always') {
            return true
          }
        }
        return false
      })

      if (networkModeIndex !== -1) {
        properties.splice(networkModeIndex, 1)
      }
    })

  return root.toSource()
}
