import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'

const DOCS_DIR = 'src/content/en/docs'
const PUBLIC_DIR = 'public'
const BASE_URL = 'https://suspensive.org'

interface DocInfo {
  title: string
  description: string
  content: string
  url: string
  category: string
}

async function main() {
  const files = await glob(`${DOCS_DIR}/**/*.mdx`)

  const docs: DocInfo[] = []
  for (const file of files) {
    const doc = processFile(file)
    if (doc) docs.push(doc)
  }

  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), buildLLMsTxt(docs))
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'llms-full.txt'),
    buildLLMsFullTxt(docs)
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
      description = trimmed.slice(0, 150)
      break
    }
  }

  const categoryMatch = filePath.match(/docs\/([^/]+)\//)
  const category = categoryMatch?.[1] || 'general'

  const relativePath = filePath.replace(DOCS_DIR, '/docs').replace(/\.mdx$/, '')
  const url = `${BASE_URL}${relativePath}`

  const cleanContent = cleanMDXContent(content)

  return { title, description, content: cleanContent, url, category }
}

function cleanMDXContent(content: string): string {
  // Preserve code blocks
  const codeBlocks: string[] = []
  let processed = content.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match)
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`
  })

  processed = processed
    .replace(/^import .+$/gm, '')
    .replace(/^---[\s\S]*?---/m, '')
    .replace(/<\/?[A-Za-z][A-Za-z0-9.]*[^>]*\/?>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  // Restore code blocks
  codeBlocks.forEach((block, i) => {
    processed = processed.replace(`__CODE_BLOCK_${i}__`, block)
  })

  return processed
}

function getLLMsFileUrl(url: string): string {
  return url + '.md'
}

function buildLLMsTxt(docs: DocInfo[]): string {
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

  const mainCategories = ['react', 'react-query', 'jotai', 'codemods']
  for (const category of mainCategories) {
    const categoryDocs = byCategory.get(category)
    if (!categoryDocs) continue

    output += `## @suspensive/${category}\n\n`
    for (const doc of categoryDocs) {
      const mdUrl = getLLMsFileUrl(doc.url)
      output += `- [${doc.title}](${mdUrl}): ${doc.description}\n`
    }
    output += '\n'
  }

  output += `## Optional\n\n`
  const optionalDocs = docs.filter((d) =>
    ['changelogs', 'contributors', 'links'].some((o) => d.url.includes(o))
  )
  for (const doc of optionalDocs) {
    const mdUrl = getLLMsFileUrl(doc.url)
    output += `- [${doc.title}](${mdUrl})\n`
  }

  return output
}

function buildLLMsFullTxt(docs: DocInfo[]): string {
  let output = `# Suspensive - Full Documentation\n\n`

  for (const doc of docs) {
    output += `---\n\n## ${doc.title}\n\nURL: ${doc.url}\n\n${doc.content}\n\n`
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

    const fileContent = `# ${doc.title}

URL: ${doc.url}

${doc.content}
`

    fs.writeFileSync(filePath, fileContent)
  }
}

main().catch(console.error)
