'use client'

import type { $NextraMetadata, Heading } from 'nextra'
import { type ReactNode } from 'react'
import { FadeIn } from './FadeIn'
import { useMDXComponents as getMDXComponents } from '@/mdx-components'

type MDXContentProps = {
  toc: Array<Heading>
  sourceCode: string
  metadata: $NextraMetadata
  isIndexPage: boolean
  mdxPath: string[]
  children: ReactNode
}

const MDXComponents = getMDXComponents()

export function MDXContent({
  toc,
  sourceCode,
  metadata,
  isIndexPage,
  mdxPath,
  children,
}: MDXContentProps) {
  return (
    <MDXComponents.wrapper
      toc={toc}
      metadata={metadata}
      sourceCode={isIndexPage ? '' : sourceCode}
    >
      {isIndexPage ? (
        children
      ) : (
        <FadeIn key={mdxPath.join('/')}>{children}</FadeIn>
      )}
    </MDXComponents.wrapper>
  )
}
