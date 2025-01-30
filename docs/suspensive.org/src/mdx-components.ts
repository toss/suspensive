import { Pre, withIcons } from 'nextra/components'
import { GitHubIcon } from 'nextra/icons'
import { useMDXComponents as getDocsMDXComponents } from 'nextra-theme-docs'

export const useMDXComponents: typeof getDocsMDXComponents = () => ({
  ...getDocsMDXComponents({
    pre: withIcons(Pre, { js: GitHubIcon }),
  }),
})
