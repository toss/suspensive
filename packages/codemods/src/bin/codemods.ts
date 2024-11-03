#!/usr/bin/env node
/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// Based on https://github.com/reactjs/react-codemod

import { Command } from '@commander-js/extra-typings'
import packageJson from '../../package.json'
import { transformRunner } from './transformRunner'

const program = new Command(packageJson.name)

program
  .description(packageJson.description)
  .version(packageJson.version, '-v, --version', 'Output the current version of @suspensive/codemods.')
  .argument('[codemod]', 'Codemod slug to run.')
  .argument('[path]', 'Path to source directory.')
  .usage('[codemod] [path]')
  .helpOption('-h, --help', 'Display this help message.')
  .action((codemod, path) => transformRunner(codemod, path))

program.parse(process.argv)
