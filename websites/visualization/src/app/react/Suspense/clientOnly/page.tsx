'use client'

import { Suspense } from '@suspensive/react'
import { Suspense as ReactSuspense, type SuspenseProps, useEffect, useState } from 'react'

export default function Page() {
  return (
    <>
      <Suspense clientOnly fallback={<RenderCounter name="Suspensive's Suspense.fallback" />}>
        <RenderCounter name="Suspensive's Suspense" />
      </Suspense>

      <SuspenseLegacy fallback={<RenderCounter name="Suspensive's SuspenseLegacy.fallback" />}>
        <RenderCounter name="Suspensive's SuspenseLegacy" />
      </SuspenseLegacy>
    </>
  )
}

const RenderCounter = ({ name }: { name: string }) => {
  console.count(`${name}(RenderCounter) render count`)
  return <>{name}</>
}

const SuspenseLegacy = (props: SuspenseProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted ? <ReactSuspense {...props} /> : props.fallback
}
