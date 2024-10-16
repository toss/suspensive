import Table from 'cli-table3'
import {
  type PackageJson,
  getSuspensiveReactQueryPackageJson,
  getTanStackReactQueryAPIs,
  getTargetSuspensiveReactQueryAPIs,
  loadModule,
} from './package'

export function getStatusTable(currentTargetVersion: string) {
  const module = loadModule<PackageJson>('@suspensive/react-query/package.json')
  assert(module.isSuccess, '@suspensive/react-query `package.json` is not found.')
  const packageJson = module.exports
  const tanStackReactQueryPackageJsonModule = loadModule<PackageJson>('@tanstack/react-query/package.json')
  assert(
    tanStackReactQueryPackageJsonModule.isSuccess,
    '@tanstack/react-query is not found. Please install @tanstack/react-query.'
  )

  const targetSuspensiveReactQueryPackageJson = getSuspensiveReactQueryPackageJson(
    tanStackReactQueryPackageJsonModule.exports.version.split('.')[0]
  )
  const isCompatible = currentTargetVersion === tanStackReactQueryPackageJsonModule.exports.version.split('.')[0]
  const suspensiveReactQueryAPIs = getTargetSuspensiveReactQueryAPIs()
  const tanStackReactQueryAPIs = getTanStackReactQueryAPIs(
    tanStackReactQueryPackageJsonModule.exports.version.split('.')[0]
  )

  const table = new Table({
    head: [
      // @ts-expect-error Type
      { content: `${packageJson.name}@${packageJson.version}`, colSpan: 2 },
      'status',
      'available interfaces',
    ],
    style: { head: ['cyan'] },
    colWidths: [10, 30, 8, 36],
    wordWrap: true,
  })
  table.push([
    { content: 'exports from', rowSpan: 2 },
    `@suspensive/react-query-${currentTargetVersion}\n@${targetSuspensiveReactQueryPackageJson.version}`,
    isCompatible ? '🟢' : '❌',
    suspensiveReactQueryAPIs.filter((api) => !tanStackReactQueryAPIs.includes(api)).join(' '),
  ])
  table.push([
    `@tanstack/react-query\n@${tanStackReactQueryPackageJsonModule.exports.version}`,
    isCompatible ? '🟢' : '❌',
    tanStackReactQueryAPIs.join(' '),
  ])
  if (!isCompatible) {
    table.push([
      {
        content: `You should \`npx srq switch ${tanStackReactQueryPackageJsonModule.exports.version.split('.')[0]}\` to fix this`,
        colSpan: 4,
      },
    ])
  }

  return table.toString()
}
