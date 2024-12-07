import Table from 'cli-table3'
import {
  getPackageJson,
  getSuspensiveReactQueryPackageJson,
  getTanStackReactQueryAPIs,
  getTanStackReactQueryPackageJson,
  getTargetSuspensiveReactQueryAPIs,
} from './package'

export function getStatusTable(currentTargetVersion: string) {
  const packageJson = getPackageJson()
  const tanStackReactQueryPackageJson = getTanStackReactQueryPackageJson()
  const tanStackReactQueryMajorVersion = tanStackReactQueryPackageJson.version.split('.')[0]
  const targetSuspensiveReactQueryPackageJson = getSuspensiveReactQueryPackageJson(tanStackReactQueryMajorVersion)
  const suspensiveReactQueryAPIs = getTargetSuspensiveReactQueryAPIs()
  const tanStackReactQueryAPIs = getTanStackReactQueryAPIs(tanStackReactQueryMajorVersion)
  const isVersionCompatible = currentTargetVersion === tanStackReactQueryMajorVersion
  const statusSymbol = isVersionCompatible ? '🟢' : '❌'

  const table = new Table({
    style: { head: ['cyan'] },
    colWidths: [10, 30, 8, 36],
    wordWrap: true,
  })
  table.push([{ content: `${packageJson.name}@${packageJson.version}`, colSpan: 2 }, 'status', 'available interfaces'])
  table.push([
    { content: 'exports from', rowSpan: 2 },
    `@suspensive/react-query-${currentTargetVersion}\n@${targetSuspensiveReactQueryPackageJson.version}`,
    statusSymbol,
    suspensiveReactQueryAPIs.filter((api) => !tanStackReactQueryAPIs.includes(api)).join(' '),
  ])
  table.push([
    `@tanstack/react-query\n@${tanStackReactQueryPackageJson.version}`,
    statusSymbol,
    tanStackReactQueryAPIs.join(' '),
  ])
  if (!isVersionCompatible) {
    table.push([{ content: `You should \`npx srq switch ${tanStackReactQueryMajorVersion}\` to fix this`, colSpan: 4 }])
  }

  return table.toString()
}
