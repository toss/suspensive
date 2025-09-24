/**
 * @fileoverview Rule to check if components using Suspense-related APIs are wrapped in a Suspense boundary
 * @author Suspensive Team
 */

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'ensure components using Suspense-related APIs are wrapped in a Suspense boundary',
      category: 'Possible Errors',
      recommended: true,
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          suspenseHooks: {
            type: 'array',
            items: { type: 'string' },
            default: ['useSuspenseQuery', 'useSuspenseInfiniteQuery', 'useSuspenseQueries'],
          },
          suspenseComponents: {
            type: 'array',
            items: { type: 'string' },
            default: ['SuspenseQuery', 'SuspenseInfiniteQuery', 'SuspenseQueries'],
          },
          suspenseWrappers: {
            type: 'array',
            items: { type: 'string' },
            default: ['Suspense'],
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingSuspenseWrapper: 'Component using "{{name}}" must be wrapped in a Suspense boundary.',
      missingLazySuspenseWrapper: 'Lazy component "{{name}}" must be wrapped in a Suspense boundary.',
    },
  },

  create(context) {
    const options = context.options[0] || {}
    const suspenseHooks = new Set(
      options.suspenseHooks || ['useSuspenseQuery', 'useSuspenseInfiniteQuery', 'useSuspenseQueries']
    )
    const suspenseComponents = new Set(
      options.suspenseComponents || ['SuspenseQuery', 'SuspenseInfiniteQuery', 'SuspenseQueries']
    )
    const suspenseWrappers = new Set(options.suspenseWrappers || ['Suspense'])

    /**
     * Get JSX element name from JSX identifier
     */
    function getJSXElementName(nameNode) {
      if (nameNode.type === 'JSXIdentifier') {
        return nameNode.name
      }
      if (nameNode.type === 'JSXMemberExpression') {
        return `${getJSXElementName(nameNode.object)}.${nameNode.property.name}`
      }
      return null
    }

    /**
     * Check if a node is inside a Suspense boundary
     */
    function isInsideSuspenseBoundary(node) {
      let parent = node.parent
      while (parent) {
        if (parent.type === 'JSXElement' && parent.openingElement && parent.openingElement.name) {
          const elementName = getJSXElementName(parent.openingElement.name)
          if (suspenseWrappers.has(elementName)) {
            return true
          }
        }
        parent = parent.parent
      }
      return false
    }

    /**
     * Check if a call expression is a suspense hook
     */
    function isSuspenseHook(node) {
      if (node.type !== 'CallExpression') return false

      let name = null
      if (node.callee.type === 'Identifier') {
        name = node.callee.name
      } else if (node.callee.type === 'MemberExpression' && node.callee.property.type === 'Identifier') {
        name = node.callee.property.name
      }

      return name && suspenseHooks.has(name)
    }

    /**
     * Check if a JSX element is a lazy component
     */
    function isLazyComponent(node) {
      if (node.type !== 'JSXElement') return false

      const elementName = getJSXElementName(node.openingElement.name)
      if (!elementName) return false

      // Check if the component was created with lazy()
      const scope = context.sourceCode.getScope(node)
      let currentScope = scope
      while (currentScope) {
        const variable = currentScope.set.get(elementName)
        if (variable && variable.defs.length > 0) {
          const def = variable.defs[0]
          if (def.node.type === 'VariableDeclarator' && def.node.init) {
            return isLazyCall(def.node.init)
          }
        }
        currentScope = currentScope.upper
      }

      return false
    }

    /**
     * Check if a call expression is a lazy() call
     */
    function isLazyCall(node) {
      if (node.type !== 'CallExpression') return false

      return (
        (node.callee.type === 'Identifier' && node.callee.name === 'lazy') ||
        (node.callee.type === 'MemberExpression' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'lazy')
      )
    }

    return {
      // Check for suspense hooks
      CallExpression: function (node) {
        if (isSuspenseHook(node) && !isInsideSuspenseBoundary(node)) {
          let name = null
          if (node.callee.type === 'Identifier') {
            name = node.callee.name
          } else if (node.callee.type === 'MemberExpression') {
            name = node.callee.property.name
          }

          context.report({
            node: node.callee,
            messageId: 'missingSuspenseWrapper',
            data: { name },
          })
        }
      },

      // Check suspense components and lazy components
      JSXElement: function (node) {
        const elementName = getJSXElementName(node.openingElement.name)

        // Check if this is a suspense component that needs wrapping
        if (elementName && suspenseComponents.has(elementName) && !isInsideSuspenseBoundary(node)) {
          context.report({
            node: node.openingElement.name,
            messageId: 'missingSuspenseWrapper',
            data: { name: elementName },
          })
        }

        // Check if this is a lazy component that needs wrapping
        if (isLazyComponent(node) && !isInsideSuspenseBoundary(node)) {
          context.report({
            node: node.openingElement.name,
            messageId: 'missingLazySuspenseWrapper',
            data: { name: elementName },
          })
        }
      },
    }
  },
}
