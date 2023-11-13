/** @jsxImportSource @emotion/react */
'use client'

import { Flex } from '@jsxcss/emotion'
import Image from 'next/image'
import Link from 'next/link'
import type { PropsWithChildren } from 'react'

export const CommonLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <TopNavigation />
      <Link href="/image">🔗 Go to @suspensive/image</Link>
      <Flex.Center flex={1}>{children}</Flex.Center>
    </>
  )
}

const TopNavigation = () => (
  <Flex.Center as={'nav'} padding={'8px 16px'} fontWeight={500} backgroundColor={'#ffffff20'}>
    <Link href="/">
      <Flex align={'center'}>
        <Image src="/logo_not_cropped.png" width={40} height={40} alt="logo" />
        Visualization
      </Flex>
    </Link>
  </Flex.Center>
)
