import Image from 'next/image'
import { Link } from 'nextra-theme-docs'
import React from 'react'

export const HomePage = ({
  title,
  description,
  buttonText,
  items,
}: {
  title: string
  description: string
  buttonText: string
  items: { title: string; desc: string }[]
}) => {
  return (
    <div>
      <div className="flex flex-col justify-center items-center pt-11 gap-8 text-center">
        <Image src="/img/logo_background_star.png" alt="Suspensive with star" width={400} height={241} />
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-bold">{title}</h1>
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
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-lg">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
