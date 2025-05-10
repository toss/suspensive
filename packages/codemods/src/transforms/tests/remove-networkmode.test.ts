// @ts-expect-error - type definitions not available
import { defineInlineTest } from 'jscodeshift/dist/testUtils'
import transform from '../remove-networkmode'
import { getTestfixtures } from '../utils/getTestfixtures'

const { input, expectedOutput, testName } = getTestfixtures('remove-networkmode', 'jsx')

defineInlineTest(transform, null, input, expectedOutput, testName)
