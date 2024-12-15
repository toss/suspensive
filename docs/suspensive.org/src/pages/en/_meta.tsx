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
    title: 'Documentation',
  },
  visualization: {
    type: 'page',
    title: 'Visualization',
    href: 'https://visualization.suspensive.org',
    newWindow: true,
  },
  versions: {
    type: 'menu',
    title: 'latest',
    items: {
      latest: {
        title: 'latest',
        href: 'https://suspensive.org',
      },
      v2: {
        title: 'v2',
        href: 'https://v2.suspensive.org',
      },
      v1: {
        title: 'v1',
        href: 'https://v1.suspensive.org',
      },
    },
  },
}
