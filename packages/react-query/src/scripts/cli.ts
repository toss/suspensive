#!/usr/bin/env node
'use strict'

import { Command } from '@commander-js/extra-typings'
import { fixAction, statusAction, switchAction } from './utils/commands'
import { getPackageJson } from './utils/package'

const packageJson = getPackageJson()
const program = new Command()

program
  .name(packageJson.name)
  .description(packageJson.description)
  .version(packageJson.version, '-v, --version', 'display the current version')

program
  .command('status')
  .description('Check the compatibility status of the current version')
  .action(() => statusAction())

program
  .command('switch')
  .description('Switch to a specific version of @suspensive/react-query')
  .argument('<version>', 'Switches the version of @suspensive/react-query')
  .action((version) => switchAction(version))

program
  .command('fix')
  .description('Fix the compatibility issues')
  .action(() => fixAction())

program.parse()
