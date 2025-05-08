// @ts-expect-error - type definitions not available
import { defineInlineTest } from 'jscodeshift/dist/testUtils'
import transform from '../migrate-with-api'
import { getTestfixtures } from '../utils/getTestfixtures'

const { input, expectedOutput, testName } = getTestfixtures('migrate-with-api', 'jsx')

defineInlineTest(transform, null, input, expectedOutput, testName)
