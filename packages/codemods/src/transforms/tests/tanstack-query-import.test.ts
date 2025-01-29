// @ts-expect-error
import { defineInlineTest } from 'jscodeshift/dist/testUtils'
import transform from '../tanstack-query-import'
import { getTestfixtures } from '../utils/getTestfixtures'

const { input, expectedOutput, testName } = getTestfixtures('tanstack-query-import', 'jsx')

defineInlineTest(transform, null, input, expectedOutput, testName)
