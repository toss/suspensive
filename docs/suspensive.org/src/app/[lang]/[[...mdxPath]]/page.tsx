import type { Metadata } from 'next'
import type { $NextraMetadata, Heading } from 'nextra'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { MDXContent } from './MDXContent'

type Page = {
  toc: Array<Heading>
  metadata: $NextraMetadata
  default: React.ComponentType<{ params: PageParams }>
}

type PageParams = {
  mdxPath: string[]
  lang: string
}

type PageProps = {
  params: PageParams
}

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const page = (await importPage(params.mdxPath, params.lang)) as Page
  return page.metadata as unknown as Metadata
}

export default async function Page({ params }: PageProps) {
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
