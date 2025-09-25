import type { MetaRecord } from 'nextra'
import type MetaEn from '../../../en/docs/react-dom/_meta'

export default {
  installation: { title: '설치하기' },
  '--- API Reference': {
    type: 'separator',
    title: 'API 문서',
  },
  Foresight: { title: '<Foresight/>' },
  InView: { title: '<InView/>' },
  useForesight: { title: 'useForesight' },
} satisfies typeof MetaEn satisfies MetaRecord
