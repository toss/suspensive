import { type NextRequest, NextResponse } from 'next/server'
import { proxy as nextraProxy } from 'nextra/locales'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip i18n proxy for .md and .txt files (LLMs.txt)
  if (pathname.endsWith('.md') || pathname.endsWith('.txt')) {
    return NextResponse.next()
  }

  return nextraProxy(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - img (image files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|img|_pagefind).*)',
  ],
}
