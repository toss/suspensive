import type { Config } from 'jest'

module.exports = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['../../node_modules/(?!@react-native|react-native)'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
  collectCoverage: true,
} satisfies Config
