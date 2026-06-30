// @ts-expect-error - type definitions not available
import { defineInlineTest } from 'jscodeshift/dist/testUtils'
import transform from '../migrate-to-v4'
import { getTestfixtures } from '../utils/getTestfixtures'

process.env.SUSPENSIVE_RQ_TARGET = '5'

const { input, expectedOutput, testName } = getTestfixtures('migrate-to-v4', 'jsx')

defineInlineTest(transform, null, input, expectedOutput, testName)
