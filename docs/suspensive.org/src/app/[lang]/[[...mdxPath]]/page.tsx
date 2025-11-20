import { getSource, enSource, koSource } from '@/lib/source'
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
  const source = getSource(params.lang)
  const page = source.getPage(params.mdxPath)

  if (!page) notFound()

  const MDX = page.data.body

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      lastUpdate={page.data.lastModified}
      editOnGithub={{
        owner: 'toss',
        repo: 'suspensive',
        path: `docs/suspensive.org/src/content/${params.lang}/${page.file.path}`,
      }}
    >
      <DocsBody>
        <h1>{page.data.title}</h1>
        <MDX />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams(): Promise<PageParams[]> {
  const enPages = enSource.getPages().map((page) => ({
    lang: 'en' as const,
    mdxPath: page.slugs,
  }))

  const koPages = koSource.getPages().map((page) => ({
    lang: 'ko' as const,
    mdxPath: page.slugs,
  }))

  return [...enPages, ...koPages]
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const source = getSource(params.lang)
  const page = source.getPage(params.mdxPath)

  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
