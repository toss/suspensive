'use client'

import { ErrorBoundary, Suspense } from '@suspensive/react'
import { SuspenseQuery } from '@suspensive/react-query-5'
import { queryOptions } from '@tanstack/react-query'
import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

const FALLBACK_DOWNLOADS = 130000

async function fetchWeeklyDownloads() {
  const response = await fetch(
    'https://api.npmjs.org/downloads/point/last-month/@suspensive/react'
  )
  if (!response.ok) {
    throw new Error('Failed to fetch npm monthly downloads')
  }

  const data = (await response.json()) as { downloads?: number }
  return data.downloads ?? FALLBACK_DOWNLOADS
}

const monthlyDownloadsQueryOptions = () =>
  queryOptions({
    queryKey: ['monthly-downloads', '@suspensive/react'],
    queryFn: fetchWeeklyDownloads,
    refetchOnWindowFocus: false,
  })

function SlotNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const digits = value.toLocaleString().split('')

  return (
    <span ref={ref} className="inline-flex overflow-hidden">
      {digits.map((char, i) => {
        if (char === ',') {
          return (
            <span key={`sep-${i}`} className="w-[0.3em]">
              ,
            </span>
          )
        }

        const num = parseInt(char, 10)
        return (
          <span
            key={`d-${i}`}
            className="relative inline-block h-[1.1em] w-[0.65em] overflow-hidden"
          >
            <motion.span
              className="absolute left-0 flex flex-col items-center"
              initial={{ y: 0 }}
              animate={isInView ? { y: `${-num * 1.1}em` } : { y: 0 }}
              transition={{
                duration: 1,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <span
                  key={n}
                  className="flex h-[1.1em] items-center justify-center"
                >
                  {n}
                </span>
              ))}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}

export const TrustedBy = ({ text }: { text: string }) => {
  return (
    <ErrorBoundary
      fallback={<TrustedByLayout downloads={FALLBACK_DOWNLOADS} text={text} />}
    >
      <Suspense
        clientOnly
        fallback={
          <TrustedByLayout downloads={FALLBACK_DOWNLOADS} text={text} />
        }
      >
        <SuspenseQuery
          {...monthlyDownloadsQueryOptions()}
          staleTime={1000 * 60 * 60}
          gcTime={1000 * 60 * 60 * 24}
          refetchOnWindowFocus={false}
        >
          {({ data: downloads }) => (
            <TrustedByLayout downloads={downloads} text={text} />
          )}
        </SuspenseQuery>
      </Suspense>
    </ErrorBoundary>
  )
}

function TrustedByLayout({
  downloads,
  text,
}: {
  downloads: number
  text: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center gap-6 py-16 md:flex-row md:justify-center md:gap-16"
    >
      <a
        href="https://www.npmjs.com/package/@suspensive/react"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 transition-opacity hover:opacity-70"
      >
        <span
          className="inline-flex min-w-[7ch] justify-center text-4xl font-bold tracking-tight tabular-nums md:text-5xl"
          aria-label={
            downloads ? `${downloads.toLocaleString()} monthly downloads` : text
          }
        >
          <SlotNumber value={downloads} />
        </span>
        <span className="text-sm opacity-40">monthly downloads</span>
      </a>

      <a
        href="https://github.com/toss/suspensive"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 transition-opacity hover:opacity-70"
      >
        <span className="text-4xl font-bold tracking-tight tabular-nums md:text-5xl">
          1k+
        </span>
        <span className="text-sm opacity-40">GitHub stars</span>
      </a>

      <a
        href="https://github.com/toss/suspensive/graphs/contributors"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-2 transition-opacity hover:opacity-70"
      >
        <img
          src="https://contrib.rocks/image?repo=toss/suspensive"
          alt="contributors"
          className="max-w-[calc(100%-2rem)] md:max-w-[480px]"
        />
        <span className="text-sm opacity-40">contributors</span>
      </a>
    </motion.div>
  )
}
