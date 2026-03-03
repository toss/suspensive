import { Link } from 'nextra-theme-docs'
import type En from './en'

export default {
  toc: {
    title: '이 페이지',
    backToTop: '맨 위로',
  },
  search: { placeholder: '검색어를 입력하세요...' },
  footer: {
    editLink: 'Edit this page on GitHub',
  },
  banner: (
    <span>
      👀 Suspensive v3에서의 변경을 확인하세요. <Link href="/ko/docs/migration/migrate-to-v3">더보기</Link>
    </span>
  ),
  lastUpdated: '수정된 날짜:',
  editPage: 'GitHub에서 이 페이지 수정하기',
} satisfies typeof En
