import Image from 'next/image'
import { Link } from 'nextra-theme-docs'
import React from 'react'

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
      <div className="flex flex-col justify-center items-center pt-11 gap-8 text-center">
        <Image src="/img/logo_background_star.png" alt="Suspensive with star" width={400} height={241} />
        <div className="flex flex-col items-center gap-4">
          <div className="relative text-5xl font-bold">
            <span>{title}</span> <span className="absolute right text-sm">v{version}</span>
          </div>
          <p className="text-3xl">{description}</p>
        </div>
        <Link href="/docs/why">
          <button className="bg-gray-800 text-xl font-bold rounded-xl py-3 px-10">{buttonText}</button>
        </Link>
      </div>

      <div className="h-14"></div>
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {items.map(({ title, desc }) => (
          <div className="flex flex-1 flex-col justify-center items-center text-center gap-3" key={title}>
            <div className="text-xl font-bold">{title}</div>
            <p className="text-lg">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
