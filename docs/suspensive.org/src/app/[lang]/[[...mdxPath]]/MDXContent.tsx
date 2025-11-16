'use client'

import type { ReactNode } from 'react'
import { FadeIn } from './FadeIn'

type MDXContentProps = {
  children: ReactNode
}

export function MDXContent({ children }: MDXContentProps) {
  return <div className="mdx-content">{children}</div>
}
