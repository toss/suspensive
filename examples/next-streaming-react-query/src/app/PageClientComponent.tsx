'use client'

import { useQueryClient } from '@tanstack/react-query'
import React, { Suspense } from 'react'
import { Text } from './components/Text'
import { Text2 } from './components/Text2'
import { query } from '~/query'
import { SuspenseQuery } from '~/react-query'

export const PageClientComponent = () => {
  const queryClient = useQueryClient()

  return (
    <>
      <Suspense fallback={<div>waiting 100....</div>}>
        <Text ms={100} />
      </Suspense>
      <Suspense fallback={<div>waiting 200....</div>}>
        <Text ms={200} />
      </Suspense>
      <Suspense fallback={<div>waiting 300....</div>}>
        <Text ms={300} />
      </Suspense>
      <Suspense fallback={<div>waiting 400....</div>}>
        <Text ms={400} />
      </Suspense>
      <Suspense fallback={<div>waiting 500....</div>}>
        <Text ms={500} />
      </Suspense>
      <Suspense fallback={<div>waiting 600....</div>}>
        <Text ms={600} />
      </Suspense>
      <Suspense fallback={<div>waiting 700....</div>}>
        <Text ms={700} />
      </Suspense>

      <button
        onClick={() => {
          console.log('resetQueries all')
          queryClient.resetQueries()
        }}
      >
        resetQueries all
      </button>

      <button
        onClick={() => {
          console.log('invalidateQueries 500')
          queryClient.invalidateQueries(query.text(500))
        }}
      >
        invalidate 500
      </button>

      <button
        onClick={() => {
          console.log('invalidateQueries 200')
          queryClient.invalidateQueries(query.text(200))
        }}
      >
        invalidate 200
      </button>

      <fieldset>
        <legend>
          combined <code>Suspense</code>-container
        </legend>
        <Suspense
          fallback={
            <>
              <div>waiting 800....</div>
              <div>waiting 900....</div>
              <div>waiting 1000....</div>
            </>
          }
        >
          <Text ms={800} />
          <Text ms={900} />
          <Text ms={1000} />
        </Suspense>
      </fieldset>

      <pre>{`Proposal: <SuspenseQuery /> Component`}</pre>
      {/* Need to proposal */}
      <ul>
        <Suspense fallback="loading...">
          <SuspenseQuery {...query.text(1100)}>{({ data }) => <Text2>{data}</Text2>}</SuspenseQuery>
        </Suspense>
        <Suspense fallback="loading...">
          <SuspenseQuery {...query.text(1200)}>{({ data }) => <Text2>{data}</Text2>}</SuspenseQuery>
        </Suspense>
        <Suspense fallback="loading...">
          <SuspenseQuery {...query.text(1300)}>{({ data }) => <Text2>{data}</Text2>}</SuspenseQuery>
        </Suspense>
      </ul>
    </>
  )
}
