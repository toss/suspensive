export const i18n = {
  languages: ['en', 'ko'],
  defaultLanguage: 'en',
} as const

export type Locale = (typeof i18n.languages)[number]
