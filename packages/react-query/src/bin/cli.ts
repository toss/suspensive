#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings'
import { fixAction, statusAction, switchAction } from './utils/commands'
import { logger } from './utils/logger'
import { getPackageJson } from './utils/package'

const packageJson = getPackageJson()
const program = new Command(packageJson.name).configureOutput({
  writeErr: (str) => logger.error(str.replace('error: ', '')),
})

program
  .description(packageJson.description)
  .version(packageJson.version, '-v, --version', 'Displays the currently installed version of @suspensive/react-query')

program
  .command('status')
  .description('Checks compatibility with the currently used version of @tanstack/react-query')
  .action(statusAction)

program
  .command('switch')
  .description(
    "Switch @suspensive/react-query's exports to use compatible Suspensive interfaces for @tanstack/react-query"
  )
  .argument(
    `@tanstack/react-query's version`,
    "Switch @suspensive/react-query's exports to use compatible Suspensive interfaces for @tanstack/react-query@<version>"
  )
  .action(switchAction)

program
  .command('fix')
  .description(
    "Automatically switch @suspensive/react-query's exports to use compatible Suspensive interfaces for @tanstack/react-query"
  )
  .action(fixAction)

try {
  program.parse(process.argv)
} catch (error) {
  if (error instanceof Error) {
    logger.error(error.message)
  }
}
