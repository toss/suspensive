import rules from './rules/index.js'

export default {
  rules,
  configs: {
    recommended: {
      plugins: ['@suspensive'],
      rules: {
        '@suspensive/check-parent-suspense': 'error',
      },
    },
  },
}