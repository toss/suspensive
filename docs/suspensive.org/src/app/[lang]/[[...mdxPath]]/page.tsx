import type { $NextraMetadata, Heading } from 'nextra'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { MDXContent } from './MDXContent'

type Page = {
  toc: Array<Heading>
  metadata: $NextraMetadata
  default: React.ComponentType<{ params: Awaited<PageProps['params']> }>
  sourceCode: string
}

type PageParams = {
  mdxPath: string[]
  lang: string
}

type PageProps = Readonly<{
  params: Promise<PageParams>
}>

export const generateStaticParams = generateStaticParamsFor('mdxPath')

const BASE_URL = 'https://suspensive.org'

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const page = (await importPage(params.mdxPath, params.lang)) as Page
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const path = params.mdxPath ? `/${params.mdxPath.join('/')}` : ''

  const title = page.metadata.title || 'Suspensive'
  const description =
    page.metadata.description || 'All in one for React Suspense'

  const metadata: Record<string, unknown> = {
    ...page.metadata,
    openGraph: {
      title,
      description,
      siteName: 'Suspensive',
      url: `${BASE_URL}/en${path}`,
      images: [
        {
          url: `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`,
      ],
    },
    alternates: {
      canonical: `${BASE_URL}/en${path}`,
      languages: {
        en: `${BASE_URL}/en${path}`,
        ko: `${BASE_URL}/ko${path}`,
      },
    },
  }

  if ('robots' in page.metadata && page.metadata.robots === 'noindex') {
    metadata.robots = { index: false, follow: true }
  }

  return metadata
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const page = (await importPage(params.mdxPath, params.lang)) as Page
  const Content = page.default
  const isIndexPage = page.metadata.filePath.includes('index.mdx')

  return (
    <MDXContent
      toc={page.toc}
      sourceCode={page.sourceCode}
      metadata={page.metadata}
      isIndexPage={isIndexPage}
      mdxPath={params.mdxPath}
    >
      <Content params={params} />
    </MDXContent>
  )
}
