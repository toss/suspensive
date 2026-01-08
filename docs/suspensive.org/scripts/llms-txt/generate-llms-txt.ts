import fs from 'node:fs'
import { glob } from 'node:fs/promises'
import path from 'node:path'
import { buildLLMsFullTxt, buildLLMsTxt } from './builders.ts'
import { DOCS_DIR, PUBLIC_DIR } from './config.ts'
import { processDocument } from './document-processor.ts'
import type { DocInfo } from './types.ts'

function writeIndividualFiles(docs: DocInfo[]): void {
  const outputDir = path.join(PUBLIC_DIR, 'docs')

  for (const doc of docs) {
    const relativePath = doc.path.replace('/docs/', '')
    const filePath = path.join(outputDir, `${relativePath}.md`)

    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, `---\nurl: ${doc.path}\n---\n\n${doc.content}\n`)
  }
}

async function main() {
  const files = await Array.fromAsync(glob(`${DOCS_DIR}/**/*.mdx`))
  const docs = files.map(processDocument)

  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), buildLLMsTxt(docs))
  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'llms-full.txt'),
    buildLLMsFullTxt(docs)
  )
  writeIndividualFiles(docs)

  console.log(
    `✅ Generated llms.txt, llms-full.txt, and ${docs.length} individual .md files`
  )
}

main().catch(console.error)
