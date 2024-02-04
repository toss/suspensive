module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4001/', 'http://localhost:4001/docs/why/'],
      startServerCommand: 'pnpm start',
      numberOfRuns: 2,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
