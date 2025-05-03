import type { CallExpression, FileInfo } from 'jscodeshift'
import { createParserFromPath } from './utils/createParserFromPath'

export default function transformer(file: FileInfo) {
  const j = createParserFromPath(file.path)
  const root = j(file.source)

  const wrapNames = root
    .find(j.ImportDeclaration, { source: { value: '@suspensive/react' } })
    .find(j.ImportSpecifier, { imported: { name: 'wrap' } })
    .nodes()
    .map((spec) => spec.local?.name ?? 'wrap')

  root.find(j.ImportDeclaration, { source: { value: '@suspensive/react' } }).forEach((path) => {
    path.node.specifiers = path.node.specifiers?.filter(
      (spec) => !(spec.type === 'ImportSpecifier' && spec.imported.name === 'wrap')
    )
  })

  const usedAPIs = new Set<string>()

  root
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        property: { type: 'Identifier', name: 'on' },
      },
    })
    .forEach((path) => {
      let current: CallExpression | CallExpression['callee'] = path.node
      const stages: Array<{ name: string; args: CallExpression['arguments'] }> = []

      while (current.type === 'CallExpression' && current.callee.type === 'MemberExpression') {
        const prop = current.callee.property
        if (prop.type === 'Identifier') {
          stages.unshift({ name: prop.name, args: current.arguments })
        }
        current = current.callee.object
      }

      const isWrapRoot =
        (current.type === 'Identifier' && wrapNames.includes(current.name)) ||
        (current.type === 'MemberExpression' &&
          current.object.type === 'Identifier' &&
          wrapNames.includes(current.object.name))
      if (!isWrapRoot) return

      const onStage = stages.find((s) => s.name === 'on')
      if (!onStage) return
      const optionStages = stages.filter((s) => s.name !== 'on')
      optionStages.forEach((stage) => usedAPIs.add(stage.name))

      let expr = onStage.args[0]
      for (let i = optionStages.length - 1; i >= 0; i--) {
        const { name, args } = optionStages[i]
        const options = args[0] ?? j.objectExpression([])
        expr = j.callExpression(j.memberExpression(j.identifier(name), j.identifier('with')), [options, expr])
      }

      j(path).replaceWith(expr)
    })

  if (usedAPIs.size > 0) {
    const reactImport = root.find(j.ImportDeclaration, { source: { value: '@suspensive/react' } })
    if (reactImport.size() > 0) {
      reactImport.forEach((path) => {
        const existing = path.node.specifiers?.map((spec) =>
          spec.type === 'ImportSpecifier' ? spec.imported.name : spec.local?.name
        )
        usedAPIs.forEach((name) => {
          if (!existing?.includes(name)) {
            path.node.specifiers?.push(j.importSpecifier(j.identifier(name)))
          }
        })
      })
    } else {
      root.find(j.Program).forEach((path) => {
        path.node.body.unshift(
          j.importDeclaration(
            Array.from(usedAPIs).map((name) => j.importSpecifier(j.identifier(name))),
            j.literal('@suspensive/react')
          )
        )
      })
    }

    return root.toSource()
  }
}
