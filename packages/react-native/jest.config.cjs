const { resolve } = require('path')

module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [resolve(__dirname, '../../packages')],
}
