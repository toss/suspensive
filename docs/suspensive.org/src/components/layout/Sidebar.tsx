'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { PageMapItem } from './DocsLayout'

export type SidebarProps = {
  pageMap: PageMapItem[]
  currentPath?: string
}

export function Sidebar({ pageMap, currentPath }: SidebarProps) {
  const pathname = usePathname()
  const activePath = currentPath || pathname

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white px-4 py-8 md:block dark:border-gray-800 dark:bg-black">
      <nav>
        <SidebarContent items={pageMap} activePath={activePath} level={0} />
      </nav>
    </aside>
  )
}

type SidebarContentProps = {
  items: PageMapItem[]
  activePath: string
  level: number
  parentRoute?: string
}

function SidebarContent({
  items,
  activePath,
  level,
  parentRoute = '',
}: SidebarContentProps) {
  return (
    <ul className={clsx('space-y-1', level > 0 && 'mt-1 ml-3')}>
      {items
        .filter((item) => item.meta?.display !== 'hidden')
        .map((item) => {
          // Generate unique key based on route hierarchy and item name
          // Use item.name as fallback for items without href (like category headers)
          const uniqueKey = parentRoute
            ? `${parentRoute}/${item.route === '#' ? item.name : item.route}`
            : item.route === '#'
              ? item.name
              : item.route
          return (
            <SidebarItem
              key={uniqueKey}
              item={item}
              activePath={activePath}
              level={level}
              parentRoute={
                item.route === '#' ? `${parentRoute}/${item.name}` : item.route
              }
            />
          )
        })}
    </ul>
  )
}

type SidebarItemProps = {
  item: PageMapItem
  activePath: string
  level: number
  parentRoute?: string
}

function SidebarItem({
  item,
  activePath,
  level,
  parentRoute,
}: SidebarItemProps) {
  const [isOpen, setIsOpen] = useState(
    activePath.startsWith(item.route) || level === 0
  )
  const isActive = activePath === item.route
  const hasChildren = item.children && item.children.length > 0

  if (item.meta?.type === 'separator') {
    return <li className="my-4 border-t border-gray-200 dark:border-gray-800" />
  }

  return (
    <li>
      <div className="flex items-center gap-1">
        {hasChildren && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={isOpen ? 'Collapse' : 'Expand'}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className={clsx(
                'transition-transform',
                isOpen ? 'rotate-90' : 'rotate-0'
              )}
            >
              <path
                d="M4 2L8 6L4 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <Link
          href={item.route}
          className={clsx(
            'flex-1 rounded px-2 py-1.5 text-sm transition-colors',
            isActive
              ? 'bg-blue-50 font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100',
            !hasChildren && 'ml-5'
          )}
        >
          {item.meta?.title || item.name}
        </Link>
      </div>

      {hasChildren && isOpen && (
        <SidebarContent
          items={item.children}
          activePath={activePath}
          level={level + 1}
          parentRoute={item.route}
        />
      )}
    </li>
  )
}
