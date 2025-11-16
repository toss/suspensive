import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FadeIn } from './FadeIn'

type PageParams = {
  mdxPath?: string[]
  lang: string
}

type PageProps = Readonly<{
  params: Promise<PageParams>
}>

// For now, generate static params for the homepage
export async function generateStaticParams(): Promise<PageParams[]> {
  return [
    { lang: 'en', mdxPath: [] },
    { lang: 'ko', mdxPath: [] },
  ]
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  return {
    title: 'Suspensive',
    description: 'All in one for React Suspense',
  }
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const mdxPath = params.mdxPath || []

  // Homepage
  if (mdxPath.length === 0) {
    try {
      const IndexPage = await import(`@/content/${params.lang}/index.mdx`)
      const Content = IndexPage.default
      return (
        <div className="p-6">
          <Content />
        </div>
      )
    } catch (error) {
      console.error('Error loading index page:', error)
      notFound()
    }
  }

  // Other pages - try to load the MDX file
  try {
    const pagePath = mdxPath.join('/')
    const Page = await import(`@/content/${params.lang}/${pagePath}.mdx`)
    const Content = Page.default

    return (
      <FadeIn key={mdxPath.join('/')}>
        <div className="mx-auto max-w-4xl p-6">
          <article className="prose dark:prose-invert">
            <Content />
          </article>
        </div>
      </FadeIn>
    )
  } catch (error) {
    console.error(`Error loading page ${mdxPath.join('/')}:`, error)
    notFound()
  }
}
