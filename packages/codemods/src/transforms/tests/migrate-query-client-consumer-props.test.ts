// @ts-expect-error - type definitions not available
import { defineInlineTest } from 'jscodeshift/dist/testUtils'
import transform from '../migrate-query-client-consumer-props'
import { getTestfixtures } from '../utils/getTestfixtures'

const { input, expectedOutput, testName } = getTestfixtures('migrate-query-client-consumer-props', 'jsx')

defineInlineTest(transform, null, input, expectedOutput, testName)
