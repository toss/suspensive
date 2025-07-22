'use client'

import { Suspense, lazy } from '@suspensive/react'
import React, { useState } from 'react'

const Comp = lazy(() => import('./Comp'), {
  onError: ({ error }) => {
    console.error(error)
    window.location.reload()
  },
})

export default function Page() {
  const [isShow, setIsShow] = useState(false)
  return (
    <div>
      <button
        onClick={() => {
          Comp.load()
        }}
      >
        load
      </button>
      <Suspense fallback={<div>loading...</div>}>
        {isShow ? (
          <Comp />
        ) : (
          <button type="button" onClick={() => setIsShow(true)}>
            show
          </button>
        )}
      </Suspense>
    </div>
  )
}
