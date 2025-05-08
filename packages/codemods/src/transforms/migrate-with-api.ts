import type { CallExpression, FileInfo } from 'jscodeshift'
import { createParserFromPath } from './utils/createParserFromPath'

export default function transformer(file: FileInfo) {
  const j = createParserFromPath(file.path)
  const root = j(file.source)

  const usedSuspensiveAPIs = new Set<string>()
  const wrapImportNodes = root.find(j.ImportDeclaration, { source: { value: '@suspensive/react' } })
  const wrapImportNames = wrapImportNodes
    .find(j.ImportSpecifier, { imported: { name: 'wrap' } })
    .nodes()
    .map((spec) => spec.local?.name ?? 'wrap')
  for (const path of wrapImportNodes.nodes()) {
    path.specifiers = path.specifiers?.filter(
      (spec) => !(spec.type === 'ImportSpecifier' && spec.imported.name === 'wrap')
    )
  }

  const callPaths = root
    .find(j.CallExpression, {
      callee: {
        type: 'MemberExpression',
        property: { type: 'Identifier', name: 'on' },
      },
    })
    .paths()
  for (const path of callPaths) {
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
      (current.type === 'Identifier' && wrapImportNames.includes(current.name)) ||
      (current.type === 'MemberExpression' &&
        current.object.type === 'Identifier' &&
        wrapImportNames.includes(current.object.name))
    if (!isWrapRoot) continue // not a wrap root

    const onStage = stages.find((s) => s.name === 'on')
    if (!onStage) continue // not exist on
    const wrapComponentStages = stages.filter((s) => s.name !== 'on')
    for (const stage of wrapComponentStages) {
      usedSuspensiveAPIs.add(stage.name)
    }

    let withNode = onStage.args[0]
    for (let i = wrapComponentStages.length - 1; i >= 0; i--) {
      const { name, args } = wrapComponentStages[i]
      const options = args[0] ?? j.objectExpression([])
      withNode = j.callExpression(j.memberExpression(j.identifier(name), j.identifier('with')), [options, withNode])
    }

    j(path).replaceWith(withNode)
  }

  if (usedSuspensiveAPIs.size > 0) {
    const suspensiveReactImport = root.find(j.ImportDeclaration, { source: { value: '@suspensive/react' } })
    if (suspensiveReactImport.size() > 0) {
      for (const path of suspensiveReactImport.nodes()) {
        const existing = path.specifiers?.map((spec) =>
          spec.type === 'ImportSpecifier' ? spec.imported.name : spec.local?.name
        )
        for (const name of Array.from(usedSuspensiveAPIs)) {
          if (!existing?.includes(name)) {
            path.specifiers?.push(j.importSpecifier(j.identifier(name)))
          }
        }
      }
    } else {
      for (const path of root.find(j.Program).nodes()) {
        path.body.unshift(
          j.importDeclaration(
            Array.from(usedSuspensiveAPIs).map((name) => j.importSpecifier(j.identifier(name))),
            j.literal('@suspensive/react')
          )
        )
      }
    }

    return root.toSource()
  }
}
