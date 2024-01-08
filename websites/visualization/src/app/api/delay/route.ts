import { NextResponse } from 'next/server'
import { delay } from '~/utils/delay'

export const GET = (req: Request) => {
  const url = new URL(req.url)
  const [waitMs, percentage] = ['waitMs', 'percentage'].map((key) => Number(url.searchParams.get(key)))

  return delay(waitMs).then(() =>
    Math.random() * 100 < percentage
      ? NextResponse.json(`Success after ${waitMs}ms ${new Date().toISOString()}`)
      : NextResponse.json('Server Error', { status: 500 })
  )
}
