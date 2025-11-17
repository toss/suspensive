'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { usePathname, useRouter } from 'next/navigation'

export type LocaleSwitchProps = {
  locales?: Array<{ locale: string; name: string }>
}

export function LocaleSwitch({ locales }: LocaleSwitchProps) {
  const pathname = usePathname()
  const router = useRouter()

  const defaultLocales = [
    { locale: 'en', name: 'English' },
    { locale: 'ko', name: '한국어' },
  ]

  const availableLocales = locales || defaultLocales

  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'en'
  const currentLocaleName =
    availableLocales.find((l) => l.locale === currentLocale)?.name || 'English'

  const handleLocaleChange = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label="Change language"
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
            <circle cx="8" cy="8" r="7" />
            <path d="M1 8h14M8 1a15 15 0 0 1 4 7 15 15 0 0 1-4 7 15 15 0 0 1-4-7 15 15 0 0 1 4-7z" />
          </svg>
          <span className="hidden sm:inline">{currentLocaleName}</span>
          <svg
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 5 3 3 3-3" />
          </svg>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[8rem] overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-900"
          sideOffset={5}
        >
          {availableLocales.map((locale) => (
            <DropdownMenu.Item
              key={locale.locale}
              className="flex cursor-pointer items-center rounded px-3 py-2 text-sm text-gray-700 outline-none hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onSelect={() => handleLocaleChange(locale.locale)}
            >
              {locale.name}
              {currentLocale === locale.locale && (
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-auto"
                >
                  <path d="m5 8 2 2 4-4" />
                </svg>
              )}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
