import 'server-only'
import type En from './en'

// We enumerate all dictionaries here for better linting and TypeScript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import('./en'),
  ko: () => import('./ko'),
} as const satisfies Record<string, () => Promise<{ default: typeof En }>>

export const getDictionary = async (
  locale: keyof typeof dictionaries
): Promise<typeof En> => (await dictionaries[locale]()).default

export const getDirection = (locale: keyof typeof dictionaries) => {
  switch (locale) {
    case 'en':
    case 'ko':
    default:
      return 'ltr' as const
  }
}
