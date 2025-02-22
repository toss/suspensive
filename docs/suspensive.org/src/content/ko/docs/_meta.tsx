import type { MetaRecord } from 'nextra'
import type MetaEn from '../../en/docs/_meta'

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
  'migrate-to-v3': {
    title: 'v3로 마이그레이션하기',
  },
  'migrate-to-v2': {
    title: 'v2로 마이그레이션하기',
  },
  changelogs: {
    title: 'Changelogs',
  },
  contributors: {
    title: '기여자',
  },
  links: {
    title: '관련 링크',
  },
} satisfies typeof MetaEn satisfies MetaRecord
