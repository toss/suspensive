/**
 * Transform Nextra/MDX components to markdown-friendly format
 */

export function transformNextraComponents(content: string): string {
  // Preserve code blocks and inline code first
  const preserved: string[] = []
  let result = content
    .replace(/```[\s\S]*?```/g, (match) => {
      preserved.push(match)
      return `__PRESERVED_${preserved.length - 1}__`
    })
    .replace(/`[^`]+`/g, (match) => {
      preserved.push(match)
      return `__PRESERVED_${preserved.length - 1}__`
    })

  // <Tabs items={['A', 'B', 'C']}> ... </Tabs>
  result = result.replace(
    /<Tabs\s+items=\{(\[[^\]]+\])\}>([\s\S]*?)<\/Tabs>/g,
    (_match, itemsStr: string, tabsContent: string) => {
      const items = JSON.parse(itemsStr.replace(/'/g, '"')) as string[]
      const tabs = tabsContent.split(/<Tabs\.Tab>/).filter((t) => t.trim())

      return tabs
        .map((tab, i) => {
          const tabContent = tab.replace(/<\/Tabs\.Tab>/g, '').trim()
          if (!tabContent) return ''
          return `#### ${items[i] || `Tab ${i + 1}`}\n\n${tabContent}`
        })
        .filter(Boolean)
        .join('\n\n')
    }
  )

  // <Callout type="info"> ... </Callout>
  result = result.replace(
    /<Callout(?:\s+type=['"](\w+)['"])?\s*>([\s\S]*?)<\/Callout>/g,
    (_match, type: string | undefined, calloutContent: string) => {
      const label = type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Note'
      const lines = calloutContent.trim().split('\n')
      return `> **${label}:** ${lines.join('\n> ')}`
    }
  )

  // <Sandpack> ... </Sandpack> -> Remove
  result = result.replace(/<Sandpack[\s\S]*?<\/Sandpack>/g, '')

  // Remove top-level imports and frontmatter
  result = result.replace(/^import .+$/gm, '')
  result = result.replace(/^---[\s\S]*?---/m, '')

  // Self-closing custom components like <Component />
  result = result.replace(/<[A-Z][A-Za-z0-9]*(?:\s+[^>]*)?\s*\/>/g, '')

  // Opening/closing custom components wrapper tags
  result = result.replace(/<\/?[A-Z][A-Za-z0-9.]*[^>]*>/g, '')

  // Restore preserved content
  preserved.forEach((block, i) => {
    result = result.replace(`__PRESERVED_${i}__`, block)
  })

  return result
}
