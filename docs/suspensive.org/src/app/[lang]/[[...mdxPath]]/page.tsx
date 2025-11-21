import type { Metadata } from 'next'
import { MDXContent } from './MDXContent'
import { DocsLayout } from '@/components/layout'
import { getAllMdxFiles, getMdxContent } from '@/lib/mdx'
import { getPageMap } from '@/lib/page-map'

type PageParams = {
  mdxPath?: string[]
  lang: 'en' | 'ko'
}

type PageProps = Readonly<{
  params: Promise<PageParams>
}>

export async function generateStaticParams(): Promise<
  { mdxPath: string[]; lang: string }[]
> {
  const locales = ['en', 'ko']
  const params: { mdxPath: string[]; lang: string }[] = []

  for (const lang of locales) {
    const paths = await getAllMdxFiles(lang)
    for (const mdxPath of paths) {
      params.push({ mdxPath, lang })
    }
  }

  return params
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const { lang, mdxPath = [] } = params

  const content = await getMdxContent(lang, mdxPath)

  if (!content) {
    return {
      title: 'Not Found',
    }
  }

  const title = (content.frontmatter as any)?.title || 'Suspensive'

  return {
    title,
  }
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const { lang, mdxPath = [] } = params

  const content = await getMdxContent(lang, mdxPath)
  const pageMap = getPageMap(lang)

  if (!content) {
    return <div>Page not found</div>
  }

  const isIndexPage =
    mdxPath.length === 0 || mdxPath[mdxPath.length - 1] === 'index'
  const currentPath = `/${lang}${mdxPath.length > 0 ? `/${mdxPath.join('/')}` : ''}`

  return (
    <DocsLayout pageMap={pageMap} toc={content.toc} currentPath={currentPath}>
      <MDXContent
        toc={content.toc}
        sourceCode={content.sourceCode}
        metadata={content.frontmatter}
        isIndexPage={isIndexPage}
        mdxPath={mdxPath}
      >
        {content.content}
      </MDXContent>
    </DocsLayout>
  )
}
