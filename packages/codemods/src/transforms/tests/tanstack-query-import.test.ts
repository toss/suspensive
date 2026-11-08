// @ts-expect-error - type definitions not available
import { defineInlineTest } from 'jscodeshift/dist/testUtils'
import transform from '../tanstack-query-import'
import { getTestfixtures } from '../utils/getTestfixtures'

const jsx = getTestfixtures('tanstack-query-import', 'jsx')
const tsx = getTestfixtures('tanstack-query-import', 'tsx')

defineInlineTest(transform, null, jsx.input, jsx.expectedOutput, jsx.testName)
defineInlineTest(transform, null, tsx.input, tsx.expectedOutput, `${tsx.testName}-tsx`)
