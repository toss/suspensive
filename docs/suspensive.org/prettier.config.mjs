import rootConfig from '../../prettier.config.mjs'

/** @type {import("prettier").Config} */
export default {
  ...rootConfig,
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 80,
}
