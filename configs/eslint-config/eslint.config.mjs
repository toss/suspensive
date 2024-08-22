import suspensiveConfig from '@suspensive/eslint-config-js'

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
  },
  ...suspensiveConfig,
]
