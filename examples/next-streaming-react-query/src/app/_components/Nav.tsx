'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Nav = () => {
  const pathname = usePathname()
  return (
    <ul style={{ display: 'flex', gap: '10px', margin: 0 }}>
      <Link href="/">
        <li style={{ listStyle: 'none', fontWeight: pathname === '/' ? 'bold' : 'normal' }}>home</li>
      </Link>
      <Link href="/test">
        <li style={{ listStyle: 'none', fontWeight: pathname === '/test' ? 'bold' : 'normal' }}>test</li>
      </Link>
    </ul>
  )
}
