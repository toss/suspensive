import { NextResponse } from 'next/server'
import z from 'zod'

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const GETSchema = z.object({
  id: z.string(),
  requestFrom: z.string(),
  responseAt: z.string(),
})
export type GETResponse = z.infer<typeof GETSchema>
export async function GET(request: Request) {
  await sleep(40 + Math.random() * 60)
  const url = new URL(request.url)
  if (url.searchParams.get('error') === 'true') {
    return NextResponse.json('error', { status: 500 })
  }
  return NextResponse.json(
    GETSchema.parse({
      id: url.searchParams.get('id'),
      requestFrom: url.searchParams.get('from') ?? 'unknown',
      responseAt: new Date().toISOString(),
    })
  )
}
