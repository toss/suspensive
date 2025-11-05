import { NextResponse } from 'next/server'
import z from 'zod'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const GETSchema = z.object({
  id: z.string(),
  requestFrom: z.string(),
  responseAt: z.string(),
})
export async function GET(request: Request) {
  await sleep(1000)
  const url = new URL(request.url)

  return NextResponse.json(
    GETSchema.parse({
      id: url.searchParams.get('id'),
      requestFrom: url.searchParams.get('from') ?? 'unknown',
      responseAt: new Date().toISOString(),
    })
  )
}
