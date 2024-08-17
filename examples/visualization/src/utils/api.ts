import axios from 'axios'

export const api = {
  delay: (ms: number, { percentage }: { percentage: number }) =>
    axios
      .get<string>('/api/delay', {
        params: {
          waitMs: ms,
          percentage,
        },
      })
      .then(({ data }) => data),
}
