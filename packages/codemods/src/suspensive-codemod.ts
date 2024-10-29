#!/usr/bin/env node

import { Command } from 'commander'
import packageJson from '../package.json'
import { transformRunner } from './transformRunner'

const program = new Command(packageJson.name)

program
  .description(packageJson.description)
  .version(packageJson.version, '-v, --version', 'Output the current version of @suspensive/codemods')
  .argument('[codemod]', 'Codemod slug to run.')
  .argument('[path]', 'Path to source directory')
  .usage('[codemod] [path]')
  .action(transformRunner)

program.parse(process.argv)
