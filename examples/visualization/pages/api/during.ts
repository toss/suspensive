// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  const { waitMs, successPercentage } = req.query
  const time = Number(waitMs)
  const percentage = Number(successPercentage)

  const isSuccess = Math.random() < percentage / 100
  callAfter(time, () => {
    return !isSuccess ? res.status(500).json('Server Error') : res.status(200).json(`Axios Success after ${waitMs}ms`)
  })
}

const callAfter = async (ms: number, callback: () => void) => {
  let start = Date.now()
  let now = start
  while (now - start < ms) {
    now = Date.now()
  }
  callback()
}
