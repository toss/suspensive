#!/usr/bin/env node
'use strict'

import fs from 'fs'
import path from 'path'
import { Command } from '@commander-js/extra-typings'
import { getPackageJson, getTanStackReactQueryPackageJson } from './utils/package'
import { switchVersion } from './utils/switchVersion'

const packageJson = getPackageJson()
const tanStackReactQueryPackageJson = getTanStackReactQueryPackageJson()
const indexFileContent = fs.readFileSync(path.join(__dirname, '../../dist/index.js'), 'utf-8')
const suspensiveReactQueryVersion =
  (RegExp(/@suspensive\/react-query-(\d+)/).exec(indexFileContent) || [])[1] || 'not found'

const program = new Command()

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version, '-v, --version', 'display the current version')

program
  .command('status')
  .description('Check the compatibility status of the current version')
  .action(() => {
    console.warn(`"suspensive-react-query status" is experimental feature`)

    const tanStackReactQueryMajorVersion = tanStackReactQueryPackageJson.version.split('.')[0]

    console.log(`[@suspensive/react-query]`, `v${packageJson.version}`, `(${suspensiveReactQueryVersion})`)
    console.log('[@tanstack/react-query]', `v${tanStackReactQueryPackageJson.version}`)

    if (suspensiveReactQueryVersion === tanStackReactQueryMajorVersion) {
      console.log(`\nThe versions are compatible.`)
    } else {
      console.warn(
        '\nThe version of @suspensive/react-query is not compatible with the current version of @tanstack/react-query.',
        `\nPlease run 'npx suspensive-react-query switch ${suspensiveReactQueryVersion === '5' ? '4' : '5'}' to switch to the compatible version.`
      )
    }
  })

program
  .command('switch')
  .description('Switch to a specific version of @suspensive/react-query')
  .argument('<version>', 'Switches the version of @suspensive/react-query')
  .action((version) => {
    console.warn(`"suspensive-react-query status" is experimental feature`)

    if (version === '4') {
      switchVersion(4)
    } else if (version === '5') {
      switchVersion(5)
    } else {
      console.warn('[@suspensive/react-query]', `version v${version} is not supported.`)
    }
  })

program
  .command('fix')
  .description('Fix the compatibility issues')
  .action(() => {
    console.warn(`"suspensive-react-query status" is experimental feature`)

    const tanStackReactQueryMajorVersion = tanStackReactQueryPackageJson.version.split('.')[0]

    if (suspensiveReactQueryVersion === tanStackReactQueryMajorVersion) {
      console.log('[@suspensive/react-query]', `The versions are compatible.`)
    } else {
      console.log('[@suspensive/react-query]', `Switching to the compatible version...`)
      switchVersion(Number(tanStackReactQueryMajorVersion))
    }
  })

program.parse()
