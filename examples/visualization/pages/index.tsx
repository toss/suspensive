import Link from 'next/link'
import styled from '@emotion/styled'
import { Area, Box } from '../components/uis'

const Home = () => (
  <Container>
    <Area title="Check Concepts">
      <Flex>
        <Link href={'/react-boundary'} style={{ flex: 1 }}>
          <Box.Default>🔗 React Boundary</Box.Default>
        </Link>
        <Link href={'/react-query'} style={{ flex: 1 }}>
          <Box.Default>🔗 React Query</Box.Default>
        </Link>
      </Flex>
    </Area>
  </Container>
)

export default Home

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  margin: -5vh 16px 0 16px;
`

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-direction: column;

  @media (min-width: 700px) {
    flex-direction: row;
  }
`
