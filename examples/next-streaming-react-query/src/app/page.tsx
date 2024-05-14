'use client'

import { Suspense } from '@suspensive/react'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { Text } from '~/app/components/Text'
import { Text2 } from '~/app/components/Text2'
import { query } from '~/query'
import { SuspenseQuery } from '~/react-query'

export default function Page() {
  const queryClient = useQueryClient()

  return (
    <>
      <Link href="/test">to test page</Link>
      <Suspense>
        <Text ms={100} />
      </Suspense>
      <Suspense>
        <Text ms={200} />
      </Suspense>
      <Suspense>
        <Text ms={300} />
      </Suspense>
      <Suspense>
        <Text ms={400} />
      </Suspense>
      <Suspense>
        <Text ms={500} />
      </Suspense>
      <Suspense>
        <Text ms={600} />
      </Suspense>
      <Suspense>
        <Text ms={700} />
      </Suspense>

      <button
        onClick={() => {
          queryClient.resetQueries()
        }}
      >
        resetQueries all
      </button>

      <button
        onClick={() => {
          queryClient.invalidateQueries(query.text(500))
        }}
      >
        invalidate 500
      </button>

      <button
        onClick={() => {
          queryClient.invalidateQueries(query.text(200))
        }}
      >
        invalidate 200
      </button>

      <fieldset>
        <legend>
          combined <code>Suspense</code>-container
        </legend>
        <Suspense>
          <Text ms={800} />
          <Text ms={900} />
          <Text ms={1000} />
        </Suspense>
      </fieldset>

      <pre>{`Proposal: <SuspenseQuery /> Component`}</pre>
      {/* Need to proposal */}
      <ul>
        <Suspense>
          <SuspenseQuery {...query.text(1100)}>{({ data }) => <Text2>{data}</Text2>}</SuspenseQuery>
        </Suspense>
        <Suspense>
          <SuspenseQuery {...query.text(1200)}>{({ data }) => <Text2>{data}</Text2>}</SuspenseQuery>
        </Suspense>
        <Suspense>
          <SuspenseQuery {...query.text(1300)}>{({ data }) => <Text2>{data}</Text2>}</SuspenseQuery>
        </Suspense>
      </ul>
    </>
  )
}
