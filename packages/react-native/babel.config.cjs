const { createRequire } = require('module')

const rnRequire = createRequire(require.resolve('react-native'))
module.exports = {
  presets: [rnRequire.resolve('@react-native/babel-preset')],
}
