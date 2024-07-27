const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/react-native/extend-expect'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testPathIgnorePatterns: ['/node_modules/', '_site', 'site'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  collectCoverageFrom: ['components/**/*.{ts,tsx}', '!components/*/style/*.{ts,tsx}'],
  testPathIgnorePatterns: ['../../node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation)'],
  globals: {
    'ts-jest': {
      babelConfig: true,
      tsConfig: 'tsconfig.test.json',
    },
  },
}
