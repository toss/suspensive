import type { MetaRecord } from '@/types/meta'

export default {
  introduction: { title: 'What is Suspensive?' },
  '--- Packages': {
    type: 'separator',
    title: 'Packages',
  },
  react: { title: '@suspensive/react' },
  'react-query': { title: '@suspensive/react-query' },
  jotai: { title: '@suspensive/jotai' },
  codemods: { title: '@suspensive/codemods' },
  '--- More': {
    type: 'separator',
    title: 'More',
  },
  migration: {
    title: 'Migration guide',
  },
  changelogs: {
    title: 'Changelogs',
  },
  contributors: {
    title: 'Contributors',
  },
  links: {
    title: 'Related Links',
  },
} satisfies MetaRecord
