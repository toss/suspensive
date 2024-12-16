export default {
  index: {
    type: 'page',
    display: 'hidden',
    theme: {
      layout: 'raw',
    },
  },
  docs: {
    type: 'page',
    title: '문서보기',
  },
  visualization: {
    type: 'page',
    title: '시각화 자료',
    href: 'https://visualization.suspensive.org',
    newWindow: true,
  },
  versions: {
    type: 'menu',
    title: 'latest',
    items: {
      latest: {
        title: 'latest',
        href: 'https://suspensive.org/ko',
      },
      v2: {
        title: 'v2',
        href: 'https://v2.suspensive.org/ko',
      },
      v1: {
        title: 'v1',
        href: 'https://v1.suspensive.org/ko',
      },
    },
  },
}
