'use client'

import type { ReactNode } from 'react'

export type FooterProps = {
  children?: ReactNode
}

export function Footer({ children }: FooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-black">
      <div className="mx-auto px-4 text-center text-sm text-gray-600 md:px-6 dark:text-gray-400">
        {children || `MIT ${new Date().getFullYear()} © Viva Republica, Inc.`}
      </div>
    </footer>
  )
}
