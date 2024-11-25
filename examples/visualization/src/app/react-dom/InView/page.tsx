'use client'

import { InView } from '@suspensive/react-dom'

export default function Page() {
  return (
    <div>
      {Array.from({ length: 200 }).map((_, i) => (
        <InView key={i} threshold={0.8} delay={200} triggerOnce initialInView>
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
    </div>
  )
}
