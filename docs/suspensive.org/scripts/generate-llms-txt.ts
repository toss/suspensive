import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
import { transformNextraComponents } from './nextra-transform'

const DOCS_DIR = 'src/content/en/docs'
const PUBLIC_DIR = 'public'
const BASE_URL = 'https://suspensive.org'

interface MetaEntry {
  title: string
  type?: 'separator'
}

interface DocInfo {
  title: string
  description: string
  content: string
  url: string
  category: string
  slug: string
}

function parseMeta(metaPath: string): Map<string, MetaEntry> {
  if (!fs.existsSync(metaPath)) return new Map()

  const content = fs.readFileSync(metaPath, 'utf-8')
  const result = new Map<string, MetaEntry>()

  // Parse export default { ... } content
  const match = content.match(/export default\s*\{([\s\S]*)\}\s*satisfies/)
  if (!match) return result

  const body = match[1]

  // Match entries like: key: { title: 'Title' } - handles multiline format
  const entryRegex =
    /['"]?([^'":,\s]+)['"]?\s*:\s*\{[^}]*?title:\s*['"]([^'"]+)['"][^}]*?\}/g

  let entryMatch: RegExpExecArray | null
  while ((entryMatch = entryRegex.exec(body)) !== null) {
    const [, key, title] = entryMatch
    // Skip separators (keys starting with ---)
    if (key.startsWith('---')) continue
    result.set(key, { title })
  }

  return result
}

function getOrderedEntries(metaPath: string): string[] {
  if (!fs.existsSync(metaPath)) return []

  const content = fs.readFileSync(metaPath, 'utf-8')
  const match = content.match(/export default\s*\{([\s\S]*)\}\s*satisfies/)
  if (!match) return []

  const body = match[1]
  const entries: string[] = []

  // Extract keys in order
  const keyRegex = /['"]?([^'":,\s]+)['"]?\s*:\s*\{/g
  let keyMatch
  while ((keyMatch = keyRegex.exec(body)) !== null) {
    const key = keyMatch[1]
    // Skip separators (keys starting with ---)
    if (!key.startsWith('---')) {
      entries.push(key)
    }
  }

  return entries
}

async function main() {
  const files = await glob(`${DOCS_DIR}/**/*.mdx`)
  const rootMeta = parseMeta(path.join(DOCS_DIR, '_meta.tsx'))
  const rootOrder = getOrderedEntries(path.join(DOCS_DIR, '_meta.tsx'))

  const docs: DocInfo[] = []
  for (const file of files) {
    const doc = processFile(file)
    if (doc) docs.push(doc)
  }

  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'llms.txt'),
    buildLLMsTxt(docs, rootMeta, rootOrder)
  )
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'llms-full.txt'),
    buildLLMsFullTxt(docs, rootMeta, rootOrder)
  )
  generateIndividualFiles(docs)

  console.log(
    `✅ Generated llms.txt, llms-full.txt, and ${docs.length} individual .md files`
  )
}

function processFile(filePath: string): DocInfo | null {
  const content = fs.readFileSync(filePath, 'utf-8')

  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch?.[1] || path.basename(filePath, '.mdx')

  const lines = content.split('\n')
  let description = ''
  for (const line of lines) {
    const trimmed = line.trim()
    if (
      trimmed &&
      !trimmed.startsWith('#') &&
      !trimmed.startsWith('import ') &&
      !trimmed.startsWith('<') &&
      !trimmed.startsWith('---') &&
      !trimmed.startsWith('>')
    ) {
      const sentenceMatch = trimmed.match(
        /^(?:[^.!?\[\]`]|\[[^\]]*\](?:\([^)]*\))?|`[^`]*`)+[.!?]/
      )
      description = sentenceMatch ? sentenceMatch[0] : trimmed
      break
    }
  }

  const categoryMatch = filePath.match(/docs\/([^/]+)\//)
  const category = categoryMatch?.[1] || 'general'

  const slug = path.basename(filePath, '.mdx')
  const relativePath = filePath.replace(DOCS_DIR, '/docs').replace(/\.mdx$/, '')
  const url = `${BASE_URL}${relativePath}`

  const cleanContent = cleanMDXContent(content)

  return { title, description, content: cleanContent, url, category, slug }
}

function cleanMDXContent(content: string): string {
  let processed = transformNextraComponents(content)
  processed = processed.replace(/\n{3,}/g, '\n\n').trim()
  return processed
}

function getLLMsFileUrl(url: string): string {
  return url.replace(BASE_URL, '') + '.md'
}

function sortDocsByMeta(docs: DocInfo[], metaPath: string): DocInfo[] {
  const order = getOrderedEntries(metaPath)
  if (order.length === 0) return docs

  return [...docs].sort((a, b) => {
    const aIndex = order.indexOf(a.slug)
    const bIndex = order.indexOf(b.slug)
    // If not in meta, put at end
    const aOrder = aIndex === -1 ? 999 : aIndex
    const bOrder = bIndex === -1 ? 999 : bIndex
    return aOrder - bOrder
  })
}

function buildLLMsTxt(
  docs: DocInfo[],
  rootMeta: Map<string, MetaEntry>,
  rootOrder: string[]
): string {
  const byCategory = new Map<string, DocInfo[]>()
  for (const doc of docs) {
    const list = byCategory.get(doc.category) || []
    list.push(doc)
    byCategory.set(doc.category, list)
  }

  let output = `# Suspensive

> Comprehensive libraries for React Suspense, ErrorBoundary, and data fetching integrations

Suspensive provides components and hooks to simplify React Suspense implementation, error handling, and integrations with TanStack Query and Jotai.

`

  // Process categories in _meta.tsx order
  for (const key of rootOrder) {
    const meta = rootMeta.get(key)
    if (!meta) continue

    const sectionTitle = meta.title

    // Check if it's a category (folder) or a root-level doc
    const categoryDocs = byCategory.get(key)
    const isRootDoc = docs.some(
      (d) => d.category === 'general' && d.slug === key
    )

    if (categoryDocs && categoryDocs.length > 0) {
      // It's a category with sub-docs
      output += `## ${sectionTitle}\n\n`

      // Sort docs by category's _meta.tsx
      const categoryMetaPath = path.join(DOCS_DIR, key, '_meta.tsx')
      const sortedDocs = sortDocsByMeta(categoryDocs, categoryMetaPath)

      for (const doc of sortedDocs) {
        const mdUrl = getLLMsFileUrl(doc.url)
        output += `- [${doc.title}](${mdUrl}): ${doc.description}\n`
      }
      output += '\n'
    } else if (isRootDoc) {
      // It's a root-level doc (like introduction, changelogs, etc.)
      const doc = docs.find((d) => d.category === 'general' && d.slug === key)
      if (doc) {
        const mdUrl = getLLMsFileUrl(doc.url)
        output += `- [${doc.title}](${mdUrl}): ${doc.description}\n\n`
      }
    }
  }

  return output.trim() + '\n'
}

function buildLLMsFullTxt(
  docs: DocInfo[],
  rootMeta: Map<string, MetaEntry>,
  rootOrder: string[]
): string {
  let output = `# Suspensive - Full Documentation\n\n`

  // Sort docs by root order first, then by category meta
  const sortedDocs: DocInfo[] = []

  for (const key of rootOrder) {
    const categoryDocs = docs.filter((d) => d.category === key)
    const rootDoc = docs.find((d) => d.category === 'general' && d.slug === key)

    if (categoryDocs.length > 0) {
      const categoryMetaPath = path.join(DOCS_DIR, key, '_meta.tsx')
      sortedDocs.push(...sortDocsByMeta(categoryDocs, categoryMetaPath))
    } else if (rootDoc) {
      sortedDocs.push(rootDoc)
    }
  }

  // Add any docs not in root order
  for (const doc of docs) {
    if (!sortedDocs.includes(doc)) {
      sortedDocs.push(doc)
    }
  }

  for (const doc of sortedDocs) {
    const urlPath = doc.url.replace(BASE_URL, '')
    output += `---\n\n## ${doc.title}\n\nURL: ${urlPath}\n\n${doc.content}\n\n`
  }

  return output
}

function generateIndividualFiles(docs: DocInfo[]): void {
  const docsDir = path.join(PUBLIC_DIR, 'docs')

  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true })
  }

  for (const doc of docs) {
    const relativePath = doc.url.replace(`${BASE_URL}/docs/`, '')
    const filePath = path.join(docsDir, `${relativePath}.md`)

    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    const urlPath = doc.url.replace(BASE_URL, '')
    const fileContent = `---
url: ${urlPath}
---

${doc.content}
`

    fs.writeFileSync(filePath, fileContent)
  }
}

main().catch(console.error)
