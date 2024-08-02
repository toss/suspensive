import type { Config } from 'jest'

// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['../../node_modules/(?!@react-native|react-native)'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
} satisfies Config
