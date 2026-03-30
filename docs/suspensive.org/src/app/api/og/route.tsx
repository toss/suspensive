import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = searchParams.get('title') || 'Suspensive'
  const description =
    searchParams.get('description') || 'All-in-one for React Suspense'

  return new ImageResponse(
    <div
      style={{
        background: 'black',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
      }}
    >
      <div
        style={{
          fontSize: 32,
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 16,
        }}
      >
        suspensive.org
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: 'white',
          lineHeight: 1.2,
          marginBottom: 24,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 28,
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.4,
          maxWidth: 900,
        }}
      >
        {description.length > 120
          ? `${description.slice(0, 120)}...`
          : description}
      </div>
    </div>,
    { width: 1200, height: 630 }
  )
}
