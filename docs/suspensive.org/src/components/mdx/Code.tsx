import type { ComponentProps } from 'react'

export function Code({ children, ...props }: ComponentProps<'code'>) {
  return (
    <code
      {...props}
      className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100"
    >
      {children}
    </code>
  )
}
