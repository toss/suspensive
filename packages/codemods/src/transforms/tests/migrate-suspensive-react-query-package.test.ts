// @ts-expect-error - type definitions not available
import { defineInlineTest } from 'jscodeshift/dist/testUtils'
import transform from '../migrate-suspensive-react-query-package'
import { getTestfixtures } from '../utils/getTestfixtures'

process.env.SUSPENSIVE_RQ_TARGET = '5'

const { input, expectedOutput, testName } = getTestfixtures('migrate-suspensive-react-query-package', 'jsx')

defineInlineTest(transform, null, input, expectedOutput, testName)
