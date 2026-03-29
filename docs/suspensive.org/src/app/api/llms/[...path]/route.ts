import fs from 'node:fs'
import path from 'node:path'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params
  const filePath = path.join(process.cwd(), 'public', ...segments)

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const ext = path.extname(filePath)
  const contentType = ext === '.md' ? 'text/markdown' : 'text/plain'
  const body = fs.readFileSync(filePath, 'utf-8')

  return new NextResponse(body, {
    headers: {
      'Content-Type': `${contentType}; charset=utf-8`,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
