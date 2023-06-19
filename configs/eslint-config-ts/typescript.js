/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['plugin:import/typescript', './noimport.js'],
  plugins: ['import'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
}
