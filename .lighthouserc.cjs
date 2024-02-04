module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4001/', 'http://localhost:4001/docs/why/', 'http://localhost:4000/'],
      startServerCommand: 'pnpm start --filter=@suspensive/suspensive.org --filter=@suspensive/visualization',
      numberOfRuns: 2,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
