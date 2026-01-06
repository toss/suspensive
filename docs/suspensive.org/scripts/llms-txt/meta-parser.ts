import fs from 'node:fs'
import path from 'node:path'
import { DOCS_DIR, ROOT_CATEGORY } from './config'
import type { MetaEntry } from './types'

export function getMetaForCategory(category: string): MetaEntry[] {
  const metaPath =
    category === ROOT_CATEGORY
      ? path.join(DOCS_DIR, '_meta.tsx')
      : path.join(DOCS_DIR, category, '_meta.tsx')
  return parseMetaFile(metaPath)
}

/**
 * Parses Nextra _meta.tsx file and returns entries in order
 */
function parseMetaFile(metaPath: string): MetaEntry[] {
  if (!fs.existsSync(metaPath)) return []

  const content = fs.readFileSync(metaPath, 'utf-8')
  const exportMatch = content.match(
    /export default\s*\{([\s\S]*)\}\s*satisfies/
  )
  if (!exportMatch) return []

  const body = exportMatch[1]
  const entries: MetaEntry[] = []

  // Matches: key: { title: 'Title' } or 'key-name': { title: 'Title' }
  const entryPattern =
    /['"]?([^'":,\s]+)['"]?\s*:\s*\{[^}]*?title:\s*['"]([^'"]+)['"][^}]*?\}/g

  let match: RegExpExecArray | null
  while ((match = entryPattern.exec(body)) !== null) {
    const [, key, title] = match
    const isSeparator = key.startsWith('---')
    if (!isSeparator) {
      entries.push({ key, title })
    }
  }

  return entries
}
