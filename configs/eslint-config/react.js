import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import reactCompiler from 'eslint-plugin-react-compiler'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  {
    plugins: {
      react: reactRecommended,
      'react-hooks': reactHooks.configs.recommended,
      'react-compiler': reactCompiler,
    },
    languageOptions: {
      globals: {
        JSX: true,
      },
    },
    rules: {
      'react-compiler/react-compiler': 'error',
      'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]
