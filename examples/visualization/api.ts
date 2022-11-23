import axios from 'axios'

const getAxios =
  ({ waitMs = 500, successPercentage }: { waitMs?: number; successPercentage: number }) =>
  async () =>
    axios.get<string>('/api/during', {
      params: {
        waitMs,
        successPercentage,
      },
    })

export const api = {
  alwaysSuccess500: getAxios({ successPercentage: 100, waitMs: 500 }),
  alwaysSuccess1000: getAxios({ successPercentage: 100, waitMs: 1000 }),
  alwaysSuccess1500: getAxios({ successPercentage: 100, waitMs: 1500 }),
  halfSuccess: getAxios({ successPercentage: 50 }),
  almostFailure: getAxios({ successPercentage: 40 }),
  alwaysFailure: getAxios({ successPercentage: 0 }),
}
