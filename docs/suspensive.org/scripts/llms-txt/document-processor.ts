import fs from 'node:fs'
import path from 'node:path'
import { DOCS_DIR, ROOT_CATEGORY } from './config'
import { transformNextraComponents } from './nextra-transform'
import type { DocInfo, MetaEntry } from './types'

function extractTitle(content: string, fallback: string): string {
  const match = content.match(/^#\s+(.+)$/m)
  return match?.[1] ?? fallback
}

function isSkippableLine(trimmed: string): boolean {
  return (
    !trimmed ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('import ') ||
    trimmed.startsWith('<') ||
    trimmed.startsWith('---') ||
    trimmed.startsWith('>') ||
    trimmed.startsWith('- ') ||
    trimmed.startsWith('* ') ||
    /^[\w]+=/.test(trimmed) || // JSX attributes like title="..."
    trimmed.startsWith('/>')
  )
}

const SENTENCE_ENDINGS = new Set(['.', '!', '?'])

// Find index of first sentence-ending punctuation, ignoring those inside [] or ``
function findSentenceEnd(text: string): number {
  let bracketDepth = 0
  let inCode = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (char === '`') {
      inCode = !inCode
      continue
    }

    if (inCode) continue

    if (char === '[') bracketDepth++
    else if (char === ']') bracketDepth = Math.max(0, bracketDepth - 1)
    else if (bracketDepth === 0 && SENTENCE_ENDINGS.has(char)) return i
  }

  return -1
}

function extractFirstSentence(content: string): string {
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (isSkippableLine(trimmed)) continue

    const endIndex = findSentenceEnd(trimmed)
    return endIndex >= 0 ? trimmed.slice(0, endIndex + 1) : trimmed
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
