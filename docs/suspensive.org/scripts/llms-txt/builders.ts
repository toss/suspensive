import { ROOT_CATEGORY } from './config'
import { groupByCategory, sortByMeta } from './document-processor'
import { getMetaForCategory } from './meta-parser'
import type { DocInfo } from './types'

function formatDocLink(doc: DocInfo): string {
  return `- [${doc.title}](${doc.path}.md): ${doc.description}`
}

export function buildLLMsTxt(docs: DocInfo[]): string {
  const byCategory = groupByCategory(docs)
  const rootMeta = getMetaForCategory(ROOT_CATEGORY)

  const lines = [
    '# Suspensive',
    '',
    '> Comprehensive libraries for React Suspense, ErrorBoundary, and data fetching integrations',
    '',
    'Suspensive provides components and hooks to simplify React Suspense implementation, error handling, and integrations with TanStack Query and Jotai.',
    '',
  ]

  for (const { key, title } of rootMeta) {
    const categoryDocs = byCategory.get(key)
    const rootDoc = byCategory.get(ROOT_CATEGORY)?.find((d) => d.slug === key)

    if (categoryDocs && categoryDocs.length > 0) {
      lines.push(`## ${title}`, '')
      const sorted = sortByMeta(categoryDocs, getMetaForCategory(key))
      for (const doc of sorted) {
        lines.push(formatDocLink(doc))
      }
      lines.push('')
    } else if (rootDoc) {
      lines.push(formatDocLink(rootDoc), '')
    }
  }

  return lines.join('\n').trim() + '\n'
}

export function buildLLMsFullTxt(docs: DocInfo[]): string {
  const byCategory = groupByCategory(docs)
  const rootMeta = getMetaForCategory(ROOT_CATEGORY)

  const sortedDocs: DocInfo[] = []

  for (const { key } of rootMeta) {
    const categoryDocs = byCategory.get(key)
    const rootDoc = byCategory.get(ROOT_CATEGORY)?.find((d) => d.slug === key)

    if (categoryDocs && categoryDocs.length > 0) {
      sortedDocs.push(...sortByMeta(categoryDocs, getMetaForCategory(key)))
    } else if (rootDoc) {
      sortedDocs.push(rootDoc)
    }
  }

  // Append docs not listed in meta
  for (const doc of docs) {
    if (!sortedDocs.includes(doc)) {
      sortedDocs.push(doc)
    }
  }

  const sections = sortedDocs.map(
    (doc) => `---\n\n## ${doc.title}\n\nURL: ${doc.path}\n\n${doc.content}`
  )

  return `# Suspensive - Full Documentation\n\n${sections.join('\n\n')}\n`
}
