'use client'

import { useState, type ComponentProps } from 'react'

export function Pre({ children, ...props }: ComponentProps<'pre'>) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const code = props['data-code'] as string | undefined
    if (code) {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="group relative">
      <pre
        {...props}
        className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900"
      >
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 rounded-lg bg-gray-200 p-2 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        aria-label="Copy code"
      >
        {copied ? (
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 8 2 2 4-4" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="10" height="10" rx="1" />
            <path d="M7 3V1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2" />
          </svg>
        )}
      </button>
    </div>
  )
}
