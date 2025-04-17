'use client'

import { InView } from '@suspensive/react-dom'
import { useState } from 'react'

export default function Page() {
  const [inViewIndexes, setInViewIndexes] = useState<number[]>([])
  return (
    <div>
      {Array.from({ length: 200 }).map((_, index) => (
        <InView
          onInView={() => {
            console.log('onInView', index)
            setInViewIndexes((prev) => [...prev, index])
          }}
          onInViewEnd={() => {
            console.log('onInViewEnd', index)
            setInViewIndexes((prev) => prev.filter((i) => i !== index))
          }}
          key={index}
          threshold={0.8}
          delayMs={200}
        >
          {({ isInView, ref }) => (
            <div ref={ref}>
              {isInView ? (
                <div className="mt-2 flex h-14 w-96 items-center justify-center bg-white text-black">{index}</div>
              ) : (
                <div className="mt-2 flex h-14 w-96 animate-pulse items-center justify-center bg-[#ffffff80] text-black">
                  {index}
                </div>
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
