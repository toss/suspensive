import styled from '@emotion/styled'
import Image from 'next/image'
import Link from 'next/link'

export const TopNavigation = () => (
  <TopNav>
    <Link href="/">
      <Home>
        <Image src="/logo_notcropped.png" width={40} height={40} alt="logo" />
        Suspensive's Concepts Visualization
      </Home>
    </Link>
  </TopNav>
)

export const TopNav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  font-weight: 500;
  background-color: #ffffff20;
`

export const Home = styled.span`
  display: flex;
  align-items: center;
`
