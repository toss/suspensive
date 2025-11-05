import { NextResponse } from 'next/server'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET(request: Request) {
  await sleep(500)
  return NextResponse.json(
    `id: ${Number(new URL(request.url).searchParams.get('id'))} ${new Date().toISOString()} success to get text`
  )
}
