#!/usr/bin/env node
'use strict'

import { Command } from '@commander-js/extra-typings'
import { assert } from '../utils'
import { fixAction, statusAction, switchAction } from './utils/commands'
import { type PackageJson, loadModule } from './utils/package'

const module = loadModule<PackageJson>('@suspensive/react-query/package.json')
assert(module.isSuccess, '@suspensive/react-query `package.json` is not found.')
const packageJson = module.exports
const program = new Command()

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version, '-v, --version', 'Displays the currently installed version of @suspensive/react-query')

program
  .command('status')
  .description('Checks compatibility with the currently used version of @tanstack/react-query')
  .action(() => statusAction())

program
  .command('switch')
  .description(
    "Switch @suspensive/react-query's exports to use compatible Suspensive interfaces for @tanstack/react-query"
  )
  .argument(
    `@tanstack/react-query's version`,
    "Switch @suspensive/react-query's exports to use compatible Suspensive interfaces for @tanstack/react-query@<version>"
  )
  .action((version) => switchAction(version))

program
  .command('fix')
  .description(
    "Automatically switch @suspensive/react-query's exports to use compatible Suspensive interfaces for @tanstack/react-query"
  )
  .action(() => fixAction())

program.parse()
