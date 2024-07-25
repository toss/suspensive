import Table from 'cli-table3'
import {
  getExportAPIsWithoutSuspensive,
  getPackageJson,
  getSuspensiveReactQueryPackageJson,
  getTanStackReactQueryPackageJson,
  getTargetSuspensiveReactQueryAPIs,
} from './package'

export function getStatusTable(currentTargetVersion: string) {
  const packageJson = getPackageJson()
  const tanStackReactQueryPackageJson = getTanStackReactQueryPackageJson()
  const tanStackReactQueryMajorVersion = tanStackReactQueryPackageJson.version.split('.')[0]
  const targetSuspensiveReactQueryPackageJson = getSuspensiveReactQueryPackageJson(tanStackReactQueryMajorVersion)
  const isCompatible = currentTargetVersion === tanStackReactQueryMajorVersion
  const suspensiveAPIs = getTargetSuspensiveReactQueryAPIs()
  const exportAPIs = getExportAPIsWithoutSuspensive()

  const table = new Table({
    head: [
      // @ts-expect-error Type '{ content: string; colSpan: number; hAlign: string; }' is not assignable to type 'string'
      { content: `${packageJson.name}@${packageJson.version}`, colSpan: 2 },
      'status',
      'available interfaces',
    ],
    style: { head: ['cyan'] },
    colWidths: [10, 30, 10, 36],
    wordWrap: true,
  })
  table.push([
    { content: 'exports from', rowSpan: 2 },
    {
      content: `@suspensive/react-query-${currentTargetVersion}\n@${targetSuspensiveReactQueryPackageJson.version}`,
      wordWrap: true,
    },
    isCompatible ? '🟢' : '❌',
    suspensiveAPIs.join(' '),
  ])
  table.push([
    {
      content: `@tanstack/react-query\n@${tanStackReactQueryPackageJson.version}`,
      wordWrap: true,
    },
    isCompatible ? '🟢' : '❌',
    exportAPIs.length > 0 ? exportAPIs.join(' ') : '-',
  ])
  if (!isCompatible) {
    table.push([{ content: `You should \`npx srq switch ${tanStackReactQueryMajorVersion}\` to fix this`, colSpan: 4 }])
  }

  return table.toString()
}
