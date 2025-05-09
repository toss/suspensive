import type { Metadata } from 'next'
import type { $NextraMetadata, Heading } from 'nextra'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { MDXContent } from './MDXContent'

type Page = {
  toc: Array<Heading>
  metadata: $NextraMetadata
  default: React.ComponentType<{ params: Awaited<PageProps['params']> }>
}

type PageParams = {
  mdxPath: string[]
  lang: string
}

type PageProps = Readonly<{
  params: Promise<PageParams>
}>

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const page = (await importPage(params.mdxPath, params.lang)) as Page
  return page.metadata as unknown as Metadata
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const page = (await importPage(params.mdxPath, params.lang)) as Page
  const Content = page.default
  const isIndexPage = page.metadata.filePath.includes('index.mdx')

  return (
    <MDXContent
      toc={page.toc}
      metadata={page.metadata}
      isIndexPage={isIndexPage}
      mdxPath={params.mdxPath}
    >
      <Content params={params} />
    </MDXContent>
  )
}
