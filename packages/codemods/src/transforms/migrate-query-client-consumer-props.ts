import type { FileInfo } from 'jscodeshift'
import { createParserFromPath } from './utils/createParserFromPath'

export default function transform(file: FileInfo) {
  const j = createParserFromPath(file.path)
  const root = j(file.source)

  root
    .find(j.JSXElement, {
      openingElement: {
        name: { name: 'QueryClientConsumer' },
      },
    })
    .forEach((path) => {
      const attributes = path.node.openingElement.attributes || []
      const contextIndex = attributes.findIndex((attr) => attr.type === 'JSXAttribute' && attr.name.name === 'context')
      if (contextIndex !== -1) {
        attributes.splice(contextIndex, 1)
        const newAttr = j.jsxAttribute(
          j.jsxIdentifier('queryClient'),
          j.jsxExpressionContainer(j.identifier('queryClient'))
        )
        attributes.push(newAttr)
      }
    })

  return root.toSource()
}
