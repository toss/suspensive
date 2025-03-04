// @ts-expect-error - type definitions not available
import { defineInlineTest } from 'jscodeshift/dist/testUtils'
import transform from '../upgrade-query-client-consumer-api'
import { getTestfixtures } from '../utils/getTestfixtures'

const { input, expectedOutput, testName } = getTestfixtures('upgrade-query-client-consumer-api', 'jsx')

defineInlineTest(transform, null, input, expectedOutput, testName)
