import Link from 'next/link'
import type { ReactNode } from 'react'

export type CardsProps = {
  children: ReactNode
}

export function Cards({ children }: CardsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
  )
}

export type CardProps = {
  title: string
  href: string
  icon?: ReactNode
  children?: ReactNode
}

export function Card({ title, href, icon, children }: CardProps) {
  const isExternal = href.startsWith('http')

  const cardContent = (
    <div className="group flex flex-col gap-2 rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-500 hover:shadow-md dark:border-gray-800 dark:hover:border-blue-500">
      <div className="flex items-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
      </div>
      {children && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{children}</p>
      )}
    </div>
  )

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {cardContent}
      </a>
    )
  }

  return <Link href={href}>{cardContent}</Link>
}
