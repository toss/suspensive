/** @jsxImportSource @emotion/react */
'use client'

import { Flex } from '@jsxcss/emotion'
import Link from 'next/link'
import { Area, Box } from '~/components/uis'

export default function Home() {
  return (
    <Flex flex={1} justify={'center'} margin={'-5vh 16px 0 16px'}>
      <Area title="Check Concepts">
        <Flex justify={'space-between'} gap={16} direction={['column', 'row']}>
          <Link href="/react" style={{ flex: 1 }}>
            <Box.Default>🔗 @suspensive/react</Box.Default>
          </Link>
          <Link href="/react-query" style={{ flex: 1 }}>
            <Box.Default>🔗 @suspensive/react-query</Box.Default>
          </Link>
        </Flex>
      </Area>
    </Flex>
  )
}
