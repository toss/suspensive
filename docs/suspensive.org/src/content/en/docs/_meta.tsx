import type { MetaRecord } from 'nextra'

export default {
  '--- Packages': {
    type: 'separator',
    title: 'Packages',
  },
  react: { title: '@suspensive/react' },
  'react-dom': { title: '@suspensive/react-dom' },
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
