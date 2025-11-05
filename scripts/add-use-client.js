import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// Get working directory from command line argument or use process.cwd()
const workingDir = process.argv[2] || process.cwd()
const distDir = join(workingDir, 'dist')

if (!existsSync(distDir)) {
  console.warn(`⚠️  dist directory not found at ${distDir}`)
  process.exit(0)
}

const files = readdirSync(distDir)

// Add 'use client' to ClientOnly chunk files
const clientOnlyFiles = files.filter(
  (file) => file.startsWith('ClientOnly-') && (file.endsWith('.js') || file.endsWith('.cjs'))
)

for (const file of clientOnlyFiles) {
  const filePath = join(distDir, file)
  const content = readFileSync(filePath, 'utf-8')

  // Check if 'use client' already exists
  if (!content.trimStart().startsWith("'use client'") && !content.trimStart().startsWith('"use client"')) {
    const newContent = `'use client';\n\n${content}`
    writeFileSync(filePath, newContent, 'utf-8')
    console.log(`✓ Added 'use client' to ${file}`)
  }
}

console.log(`✓ Processed ${clientOnlyFiles.length} ClientOnly chunk files`)
