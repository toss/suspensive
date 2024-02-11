module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4000/', 'http://localhost:4000/docs/why/'],
      startServerCommand: 'pnpm start --filter=@suspensive/suspensive.org',
      numberOfRuns: 2,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
