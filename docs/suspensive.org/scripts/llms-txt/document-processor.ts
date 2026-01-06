import fs from 'node:fs'
import path from 'node:path'
import { transformNextraComponents } from '../nextra-transform'
import { DOCS_DIR, ROOT_CATEGORY } from './config'
import type { DocInfo, MetaEntry } from './types'

function extractTitle(content: string, fallback: string): string {
  const match = content.match(/^#\s+(.+)$/m)
  return match?.[1] ?? fallback
}

function extractFirstSentence(content: string): string {
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    const isSkippable =
      !trimmed ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('import ') ||
      trimmed.startsWith('<') ||
      trimmed.startsWith('---') ||
      trimmed.startsWith('>')

    if (isSkippable) continue

    // Extracts first sentence while preserving markdown links [text](url) and inline code `code`
    const sentencePattern =
      /^(?:[^.!?\[\]`]|\[[^\]]*\](?:\([^)]*\))?|`[^`]*`)+[.!?]/
    const match = trimmed.match(sentencePattern)
    return match ? match[0] : trimmed
  }
  return ''
}

function cleanContent(content: string): string {
  const transformed = transformNextraComponents(content)
  return transformed.replace(/\n{3,}/g, '\n\n').trim()
}

function parseFilePath(filePath: string): { category: string; slug: string } {
  const categoryMatch = filePath.match(/docs\/([^/]+)\//)
  return {
    category: categoryMatch?.[1] ?? ROOT_CATEGORY,
    slug: path.basename(filePath, '.mdx'),
  }
}

export function processDocument(filePath: string): DocInfo {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  const { category, slug } = parseFilePath(filePath)
  const relativePath = filePath.replace(DOCS_DIR, '/docs').replace(/\.mdx$/, '')

  return {
    title: extractTitle(rawContent, slug),
    description: extractFirstSentence(rawContent),
    content: cleanContent(rawContent),
    path: relativePath,
    category,
    slug,
  }
}

export function groupByCategory(docs: DocInfo[]): Map<string, DocInfo[]> {
  const groups = new Map<string, DocInfo[]>()
  for (const doc of docs) {
    const list = groups.get(doc.category) ?? []
    list.push(doc)
    groups.set(doc.category, list)
  }
  return groups
}

export function sortByMeta(
  docs: DocInfo[],
  metaEntries: MetaEntry[]
): DocInfo[] {
  if (metaEntries.length === 0) return docs

  const orderMap = new Map(
    metaEntries.map((entry, index) => [entry.key, index])
  )

  return [...docs].sort((a, b) => {
    const aOrder = orderMap.get(a.slug) ?? Infinity
    const bOrder = orderMap.get(b.slug) ?? Infinity
    return aOrder - bOrder
  })
}
