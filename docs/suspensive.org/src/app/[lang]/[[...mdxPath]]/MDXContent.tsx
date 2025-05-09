'use client'

import type { $NextraMetadata, Heading } from 'nextra'
import type { ReactNode } from 'react'
import { FadeIn } from './FadeIn'
import { useMDXComponents } from '@/mdx-components'

type MDXContentProps = {
  toc: Array<Heading>
  metadata: $NextraMetadata
  isIndexPage: boolean
  mdxPath: string[]
  children: ReactNode
}

export function MDXContent({
  toc,
  metadata,
  isIndexPage,
  mdxPath,
  children,
}: MDXContentProps) {
  const { wrapper: Wrapper } = useMDXComponents()

  return (
    <Wrapper toc={toc} metadata={metadata}>
      {isIndexPage ? (
        children
      ) : (
        <FadeIn key={mdxPath.join('/')}>{children}</FadeIn>
      )}
    </Wrapper>
  )
}
