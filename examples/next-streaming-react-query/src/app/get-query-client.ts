import { createGetQueryClient } from '@suspensive/react-query-5'
import { defaultShouldDehydrateQuery } from '@tanstack/react-query'

export const { getQueryClient } = createGetQueryClient({
  defaultOptions: {
    dehydrate: {
      shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
    },
  },
})
