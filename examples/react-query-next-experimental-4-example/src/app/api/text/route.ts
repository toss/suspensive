import { NextResponse } from 'next/server'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET(request: Request) {
  const ms = Number(new URL(request.url).searchParams.get('wait'))
  await sleep(ms)
  return NextResponse.json(`${new Date().toISOString()} success to get text waited after ${ms}ms`)
}
