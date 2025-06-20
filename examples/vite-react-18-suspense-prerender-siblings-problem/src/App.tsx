import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useState } from 'react'
import './App.css'

export default function App() {
  const [isClicked, setIsClicked] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setIsClicked(true)}>
        click to render
      </button>
      {isClicked ? (
        <Suspense fallback={<Fallback />}>
          {Array.from({ length: 10 }, (_, i) => (
            <Suspend key={i} i={i} />
          ))}
          <Slow />
        </Suspense>
      ) : (
        ' not clicked. before start, open devtools(console, network)'
      )}
    </>
  )
}

const Fallback = () => {
  console.log({ Fallback: 'Fallback' })
  return 'loading...'
}

const Slow = () => {
  console.log({ Slow: 'start' })
  const startTime = new Date().getTime()
  while (new Date().getTime() - startTime < 3000) {
    // slow trigger
  }
  console.log({ Slow: 'end' })

  return <span style={{ padding: 4, backgroundColor: 'red', marginLeft: 4 }}>Slow</span>
}

const Suspend = ({ i }: { i: number }) => {
  console.log({ Suspend: `before Suspend${i + 1}` })
  useSuspenseQuery(query.dummy(i))
  console.log({ Suspend: `after Suspend${i + 1}` })
  return <span style={{ padding: 4, backgroundColor: 'black', marginLeft: 4 }}>{i}</span>
}

const query = {
  dummy: (ms: number) =>
    queryOptions({
      queryKey: ['dummy', ms],
      queryFn: async () => {
        console.log({ fetch: `fetch${ms + 1}` })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return fetch(`https://dummyjson.com/users/${ms + 1}`).then((res) => res.json())
      },
    }),
}
