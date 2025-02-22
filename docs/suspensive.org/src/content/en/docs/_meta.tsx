import type { MetaRecord } from 'nextra'

export default {
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
  'migrate-to-v3': {
    title: 'Migrating to v3',
  },
  'migrate-to-v2': {
    title: 'Migrating to v2',
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
