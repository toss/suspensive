module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
      plugins: ['@babel/plugin-transform-flow-strip-types'],
    },
  },
}
