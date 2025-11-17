'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'

export type TOCItem = {
  depth: number
  value: string
  id: string
}

export type TableOfContentsProps = {
  toc: TOCItem[]
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0px 0px -80% 0px' }
    )

    toc.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [toc])

  if (toc.length === 0) {
    return null
  }

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 flex-shrink-0 overflow-y-auto px-4 py-8 xl:block">
      <div className="text-sm">
        <p className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
          On this page
        </p>
        <nav>
          <ul className="space-y-2">
            {toc.map((item) => (
              <li
                key={item.id}
                style={{ paddingLeft: `${(item.depth - 2) * 12}px` }}
              >
                <a
                  href={`#${item.id}`}
                  className={clsx(
                    'block border-l-2 py-1 pl-3 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
                    activeId === item.id
                      ? 'border-blue-500 font-medium text-blue-600 dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent'
                  )}
                >
                  {item.value}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
