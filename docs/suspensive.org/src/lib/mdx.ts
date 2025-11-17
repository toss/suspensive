import fs from 'fs'
import path from 'path'
import { recmaCodeHike, remarkCodeHike } from 'codehike/mdx'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import { remarkSandpack } from 'remark-sandpack'
import { useMDXComponents } from '@/mdx-components'

const codeHikeConfig = {
  syntaxHighlighting: {
    theme: 'github-dark',
  },
}

export type TOCItem = {
  depth: number
  value: string
  id: string
}

export async function getMdxContent(locale: string, slug: string[]) {
  // Try to find the MDX file
  let filePath: string

  if (slug.length === 0) {
    // Root index page
    filePath = path.join(process.cwd(), 'src', 'content', locale, 'index.mdx')
  } else {
    // First try the full path as a file
    filePath =
      path.join(process.cwd(), 'src', 'content', locale, ...slug) + '.mdx'

    // If it doesn't exist, try as an index file in a directory
    if (!fs.existsSync(filePath)) {
      filePath = path.join(
        process.cwd(),
        'src',
        'content',
        locale,
        ...slug,
        'index.mdx'
      )
    }
  }

  if (!fs.existsSync(filePath)) {
    return null
  }

  const source = fs.readFileSync(filePath, 'utf-8')

  const components = useMDXComponents()

  const { content, frontmatter } = await compileMDX({
    source,
    components,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          [remarkCodeHike as any, codeHikeConfig],
          remarkSandpack as any,
        ],
        recmaPlugins: [[recmaCodeHike as any, codeHikeConfig]],
        rehypePlugins: [
          [
            rehypePrettyCode as any,
            {
              theme: 'github-dark-default',
              keepBackground: false,
            },
          ],
        ],
      },
    },
  })

  // Extract TOC from source
  const toc = extractTOC(source)

  return {
    content,
    frontmatter,
    toc,
    sourceCode: source,
  }
}

function extractTOC(markdown: string): TOCItem[] {
  const headingRegex = /^(#{2,6})\s+(.+)$/gm
  const toc: TOCItem[] = []
  let match

  while ((match = headingRegex.exec(markdown)) !== null) {
    const depth = match[1].length
    const value = match[2].trim()
    const id = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')

    toc.push({ depth, value, id })
  }

  return toc
}

export async function getAllMdxFiles(locale: string): Promise<string[][]> {
  const contentDir = path.join(process.cwd(), 'src', 'content', locale)
  const paths: string[][] = []

  function walkDir(dir: string, currentPath: string[] = []) {
    if (!fs.existsSync(dir)) return

    const files = fs.readdirSync(dir)

    for (const file of files) {
      if (file === '_meta.tsx') continue

      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        walkDir(fullPath, [...currentPath, file])
      } else if (file.endsWith('.mdx')) {
        const name = file.replace('.mdx', '')
        if (name === 'index') {
          paths.push(currentPath.length === 0 ? [] : currentPath)
        } else {
          paths.push([...currentPath, name])
        }
      }
    }
  }

  walkDir(contentDir)
  return paths
}
