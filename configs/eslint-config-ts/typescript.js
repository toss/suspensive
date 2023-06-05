/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['./noimport.js', 'plugin:import/typescript'],
  plugins: ['import'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
}
