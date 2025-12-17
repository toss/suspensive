import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

interface MdxFile {
  path: string
  content: string
  url: string
}

function getAllMdxFiles(
  dir: string,
  baseDir: string,
  locale: string
): MdxFile[] {
  const files: MdxFile[] = []
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      files.push(...getAllMdxFiles(fullPath, baseDir, locale))
    } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8')

      // Generate URL from file path
      const relativePath = path.relative(baseDir, fullPath)
      const urlPath = relativePath
        .replace(/\\/g, '/')
        .replace(/\.mdx?$/, '')
        .replace(/\/index$/, '')

      let url = `https://suspensive.org/${locale}/${urlPath}`

      // Handle index files at root
      if (urlPath === 'index') {
        url = `https://suspensive.org/${locale}`
      }

      files.push({
        path: fullPath,
        content,
        url,
      })
    }
  }

  return files
}

function stripFrontmatter(content: string): string {
  // Remove frontmatter (YAML between --- markers)
  const frontmatterRegex = /^---\n[\s\S]*?\n---\n/
  return content.replace(frontmatterRegex, '').trim()
}

function generateLlmsTxt(): string {
  const contentDir = path.join(process.cwd(), 'src', 'content')
  const locales = ['en', 'ko']
  let output = '# Suspensive Documentation\n\n'
  output += '> Documentation for Suspensive - All in one for React Suspense\n\n'

  for (const locale of locales) {
    const localeDir = path.join(contentDir, locale)

    if (!fs.existsSync(localeDir)) {
      continue
    }

    const files = getAllMdxFiles(localeDir, localeDir, locale)

    for (const file of files) {
      const strippedContent = stripFrontmatter(file.content)

      output += `## ${file.url}\n\n`
      output += `${strippedContent}\n\n`
      output += '---\n\n'
    }
  }

  return output
}

export async function GET() {
  try {
    const content = generateLlmsTxt()

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('Error generating llms.txt:', error)
    return new NextResponse('Error generating llms.txt', { status: 500 })
  }
}
