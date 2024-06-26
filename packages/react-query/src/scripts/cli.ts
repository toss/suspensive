#!/usr/bin/env node
'use strict'

import { Command } from 'commander'
import { getPackageJson, getSuspensiveReactQueryVersion, getTanstackPackageJson } from './utils/package'
import { switchVersion } from './utils/switchVersion'

const packageJson = getPackageJson()
const tanstackPackageJson = getTanstackPackageJson()
const suspensiveReactQueryVersion = getSuspensiveReactQueryVersion()

const program = new Command()

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version, '-v, --version', 'display the current version')

program
  .command('status')
  .description('Check the status of the current version')
  .action(() => {
    const tanstackMajorVersion = tanstackPackageJson.version.split('.')[0]

    console.log(
      `[${packageJson.name}]`,
      `v${packageJson.version}`,
      `(@suspensive/react-query-${suspensiveReactQueryVersion})`
    )
    console.log('[@tanstack/react-query]', `v${tanstackPackageJson.version}`)

    if (suspensiveReactQueryVersion === tanstackMajorVersion) {
      console.log(`\nversion v${suspensiveReactQueryVersion} is supported.`)
    } else {
      console.warn(
        '\nThe version of @suspensive/react-query is not compatible with the version of @tanstack/react-query.',
        `\nPlease run 'npx suspensive-react-query switch ${tanstackMajorVersion}' to switch to the supported version.`
      )
    }
  })

program
  .command('switch')
  .description('Switch to @suspensive/react-query version')
  .argument('<version>', 'The version to switch to')
  .action((version) => {
    if (version === '4') {
      switchVersion(4)
    } else if (version === '5') {
      switchVersion(5)
    } else {
      console.warn('[@suspensive/react-query]', `version v${version} is not supported.`)
    }
  })

program.parse()
