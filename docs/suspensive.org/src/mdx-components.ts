import defaultMDXComponents from 'fumadocs-ui/mdx'

export function useMDXComponents(components?: any): any {
  return {
    ...defaultMDXComponents,
    ...components,
  }
}
