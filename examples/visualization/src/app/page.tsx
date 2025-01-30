import Link from 'next/link'
import { Area, Box } from '~/components/uis'

export default function Home() {
  return (
    <div className="-mt-5 mr-4 ml-4 flex flex-1 justify-center">
      <Area title="Check Concepts">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <Link href="/react" className="flex-1">
            <Box.Default>🔗 @suspensive/react</Box.Default>
          </Link>
          <Link href="/react-query" className="flex-1">
            <Box.Default>🔗 @suspensive/react-query</Box.Default>
          </Link>
        </div>
      </Area>
    </div>
  )
}
