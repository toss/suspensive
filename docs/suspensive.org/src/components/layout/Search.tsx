'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useCallback, useEffect, useState } from 'react'

export type SearchProps = {
  placeholder?: string
}

export function Search({
  placeholder = 'Search documentation...',
}: SearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      // Integrate with pagefind or other search solution
      console.log('Searching for:', query)
    }
  }, [query])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex w-full max-w-md items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-500 transition-colors hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-600"
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="8" r="6" />
            <path d="m13 13 3 3" />
          </svg>
          <span className="flex-1 text-left">{placeholder}</span>
          <kbd className="hidden rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600 sm:block dark:bg-gray-700 dark:text-gray-400">
            ⌘K
          </kbd>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-lg border border-gray-200 bg-white p-0 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center border-b border-gray-200 px-4 dark:border-gray-800">
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <circle cx="10" cy="10" r="8" />
              <path d="m17 17 4 4" />
            </svg>
            <input
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                }
              }}
              className="w-full border-0 bg-transparent px-4 py-4 text-gray-900 outline-none placeholder:text-gray-500 dark:text-gray-100 dark:placeholder:text-gray-400"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto p-4">
            {query ? (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Search results for "{query}" will appear here
              </div>
            ) : (
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Start typing to search...
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
