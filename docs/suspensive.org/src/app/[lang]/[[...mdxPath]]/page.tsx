import type { Heading, NextraMetadata } from 'nextra'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { FadeIn } from './FadeIn'
import { useMDXComponents } from '@/mdx-components'

type Page = {
  toc: Array<Heading>
  metadata: NextraMetadata
  default: React.ComponentType<{ params: Awaited<PageProps['params']> }>
}
export const generateStaticParams = generateStaticParamsFor('mdxPath')

type PageProps = Readonly<{
  params: Promise<{ mdxPath?: string[]; lang: string }>
}>
export const generateMetadata = async (props: PageProps) => {
  const params = await props.params
  const page = (await importPage(params.mdxPath, params.lang)) as Page
  return page.metadata
}
// eslint-disable-next-line react-hooks/rules-of-hooks
const Wrapper = useMDXComponents().wrapper
export default async function Page(props: PageProps) {
  const params = await props.params
  const page = (await importPage(params.mdxPath, params.lang)) as Page

  return (
    <Wrapper toc={page.toc} metadata={page.metadata}>
      {page.metadata.filePath.includes('index.mdx') ? (
        <page.default {...props} params={params} />
      ) : (
        <FadeIn key={params.mdxPath?.join('/')}>
          <page.default {...props} params={params} />
        </FadeIn>
      )}
    </Wrapper>
  )
}
