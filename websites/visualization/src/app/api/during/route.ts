import { NextResponse } from 'next/server'
import { delay } from '~/utils/delay'

export const GET = async (req: Request) => {
  const url = new URL(req.url)
  const [waitMs, successPercentage] = ['waitMs', 'successPercentage'].map((key) => Number(url.searchParams.get(key)))

  await delay(waitMs)

  const isSuccess = Math.random() < successPercentage / 100
  return isSuccess
    ? NextResponse.json(`Axios Success after ${waitMs}ms`)
    : NextResponse.json('Server Error', { status: 500 })
}
