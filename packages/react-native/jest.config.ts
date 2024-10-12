import type { Config } from 'jest'

const config: Config = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['../../node_modules/(?!@react-native|react-native)'],
  setupFilesAfterEnv: ['./jest.setup.ts'],
}

export default config
