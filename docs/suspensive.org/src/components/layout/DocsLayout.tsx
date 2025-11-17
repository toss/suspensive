'use client'

import { type ReactNode } from 'react'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { TableOfContents } from './TableOfContents'

export type PageMapItem = {
  name: string
  route: string
  children?: PageMapItem[]
  meta?: Record<string, any>
  frontMatter?: Record<string, any>
}

export type DocsLayoutProps = {
  children: ReactNode
  pageMap: PageMapItem[]
  toc?: Array<{ depth: number; value: string; id: string }>
  navbar?: ReactNode
  footer?: ReactNode
  themeConfig?: {
    defaultTheme?: string
    storageKey?: string
  }
  currentPath?: string
}

export function DocsLayout({
  children,
  pageMap,
  toc,
  footer,
  currentPath = '',
}: DocsLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="mx-auto flex">
        <Sidebar pageMap={pageMap} currentPath={currentPath} />

        <main className="min-w-0 flex-1 px-6 pt-4 pb-16 md:px-12">
          <article className="prose prose-slate dark:prose-invert max-w-none">
            {children}
          </article>
        </main>

        {toc && toc.length > 0 && <TableOfContents toc={toc} />}
      </div>

      {footer || <Footer />}
    </div>
  )
}
