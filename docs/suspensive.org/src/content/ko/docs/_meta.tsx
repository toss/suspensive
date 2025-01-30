import type { MetaRecord } from 'nextra'

export default {
  '--- Packages': {
    type: 'separator',
    title: '패키지',
  },
  react: { title: '@suspensive/react' },
  'react-query': { title: '@suspensive/react-query' },
  jotai: { title: '@suspensive/jotai' },
  codemods: { title: '@suspensive/codemods' },
  '--- More': {
    type: 'separator',
    title: '더보기',
  },
  'migrate-to-v2': 'v2로 마이그레이션하기',
  changelogs: 'Changelogs',
  contributors: '기여자',
  links: '관련 링크',
} satisfies MetaRecord
