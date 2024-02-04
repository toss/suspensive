module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4000/', 'http://localhost:4001/', 'http://localhost:4100/'],
      startServerCommand: 'pnpm start',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
