import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(
  components: MDXComponents = {}
): MDXComponents {
  return {
    ...components,
    wrapper: ({ children, ...props }: any) => {
      return <article {...props}>{children}</article>
    },
  }
}
