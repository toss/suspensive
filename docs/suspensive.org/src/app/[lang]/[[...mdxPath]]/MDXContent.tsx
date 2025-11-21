'use client'

import { type ReactNode } from 'react'
import { FadeIn } from './FadeIn'
import { useMDXComponents as getMDXComponents } from '@/mdx-components'

export type TOCItem = {
  depth: number
  value: string
  id: string
}

type MDXContentProps = {
  toc: TOCItem[]
  sourceCode: string
  metadata: any
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
