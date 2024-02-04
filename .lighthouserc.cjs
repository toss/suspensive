module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4001/', 'http://localhost:4001/docs/why/'],
      startServerCommand: 'pnpm start --filter=@suspensive/suspensive.org',
      numberOfRuns: 2,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
