// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require('path')

module.exports = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  // https://github.com/jestjs/jest/blob/b113b44e7252fef18c71d72e70a9293a50f50b96/examples/react-native/jest.config.js
  transformIgnorePatterns: [resolve(__dirname, '../../packages')],
}
