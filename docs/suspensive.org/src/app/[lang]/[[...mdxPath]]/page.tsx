import { getSource, source } from '@/lib/source'
import type { Locale } from '@/i18n'
import { DocsPage, DocsBody } from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

type PageParams = {
  mdxPath?: string[]
  lang: Locale
}

type PageProps = Readonly<{
  params: Promise<PageParams>
}>

export default async function Page(props: PageProps) {
  const params = await props.params
  const pageSource = getSource(params.lang)
  const page = pageSource.getPage(params.mdxPath)

  if (!page) notFound()

  const pageData: any = page.data

  return (
    <DocsPage
      toc={pageData.toc}
      full={pageData.full}
      lastUpdate={pageData.lastModified}
      editOnGithub={{
        owner: 'toss',
        repo: 'suspensive',
        path: `docs/suspensive.org/src/content/${params.lang}/${page.file.path}`,
      }}
    >
      <DocsBody>
        <h1>{pageData.title}</h1>
        <pageData.body />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const pages = source.getPages().map((page) => {
    const pathParts = page.url.split('/')
    const lang = pathParts[1] as Locale // url starts with /docs
    const mdxPath = pathParts.slice(2)

    return {
      lang,
      mdxPath: mdxPath.length > 0 ? mdxPath : undefined,
    }
  })

  return pages
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const pageSource = getSource(params.lang)
  const page = pageSource.getPage(params.mdxPath)

  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
