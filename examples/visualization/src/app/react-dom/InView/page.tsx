'use client'

import { InView } from '@suspensive/react-dom'
import { useState } from 'react'

export default function Page() {
  const [inViewIndexes, setInViewIndexes] = useState<number[]>([])
  return (
    <div>
      {Array.from({ length: 200 }).map((_, index) => (
        <InView
          onInView={() => setInViewIndexes((prev) => [...prev, index])}
          onInViewEnd={() => setInViewIndexes((prev) => prev.filter((i) => i !== index))}
          key={index}
          threshold={0.8}
          delay={200}
        >
          {({ inView, ref }) => (
            <div ref={ref}>
              {inView ? (
                <div className="mt-2 h-14 w-96 bg-white" />
              ) : (
                <div className="mt-2 h-14 w-96 animate-pulse bg-[#ffffff80]" />
              )}
            </div>
          )}
        </InView>
      ))}
      <div style={{ position: 'fixed', top: 0, backgroundColor: 'red', height: 200, overflow: 'auto', width: 200 }}>
        inViewIndexes: {inViewIndexes.join(', ')}
      </div>
    </div>
  )
}
