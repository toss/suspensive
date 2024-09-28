import Image from 'next/image'
import { Link } from 'nextra-theme-docs'
import React from 'react'
import { AnimatedGroup, TextEffect } from '@/components/motion-primitives'

export const HomePage = ({
  title,
  description,
  buttonText,
  items,
  version,
}: {
  title: string
  description: string
  buttonText: string
  items: { title: string; desc: string }[]
  version: number
}) => {
  return (
    <div className="pb-20">
      <AnimatedGroup
        className="flex flex-col items-center justify-center gap-8 pt-11 text-center"
        variants={{
          container: {
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          },
          item: {
            hidden: {
              opacity: 0,
              filter: 'blur(12px)',
              y: -60,
              rotateX: 90,
            },
            visible: {
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
              rotateX: 0,
              transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1,
              },
            },
          },
        }}
      >
        <Image src="/img/logo_background_star.png" alt="Suspensive with star" width={400} height={241} />
        <div className="flex flex-col items-center gap-4">
          <div className="relative bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-5xl font-bold text-transparent">
            <span>{title}</span> <span className="absolute text-sm">{version}</span>
          </div>
          <div className="text-xl text-neutral-500">
            <TextEffect per="char" preset="fade" delay={0.5}>
              {description}
            </TextEffect>
          </div>
        </div>
        <Link href="/docs/react/motivation">
          <button className="rounded-xl bg-gray-800 px-10 py-3 text-xl font-bold">{buttonText}</button>
        </Link>
      </AnimatedGroup>

      <div className="h-14"></div>
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
        {items.map(({ title, desc }) => (
          <div className="flex flex-1 flex-col items-start justify-center gap-3 text-left" key={title}>
            <div className="relative bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-lg font-bold text-transparent">
              {title}
            </div>
            <p className="text-sm text-neutral-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
