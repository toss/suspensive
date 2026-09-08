'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { BorderTrail } from './BorderTrail'
import { Magnetic } from './Magnetic'
import { Spotlight } from './Spotlight'
import { Tilt } from './Tilt'

export const CallToAction = ({
  title,
  primaryText,
  primaryHref,
  secondaryText,
  secondaryHref,
}: {
  title: string
  primaryText: string
  primaryHref: string
  secondaryText?: string
  secondaryHref?: string
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-8 py-20 text-center"
    >
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <Magnetic intensity={0.2} springOptions={{ bounce: 0.1 }}>
          <Tilt rotationFactor={8} isReverse>
            <Link href={primaryHref}>
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-xl bg-black px-7 py-3 text-sm font-semibold text-white/80 transition-colors duration-300 md:text-base"
              >
                <BorderTrail
                  size={120}
                  style={{
                    boxShadow:
                      '0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)',
                  }}
                />
                <Spotlight
                  className="blur-4xl bg-zinc-700"
                  size={48}
                  springOptions={{ bounce: 0.3, duration: 0.1 }}
                />
                {primaryText}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.span>
            </Link>
          </Tilt>
        </Magnetic>
        {secondaryText && secondaryHref && (
          <Magnetic intensity={0.1} springOptions={{ bounce: 0.1 }}>
            <Link href={secondaryHref}>
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 px-7 py-3 text-sm font-semibold transition-colors hover:bg-gray-50 md:text-base dark:border-gray-700 dark:hover:bg-gray-900"
              >
                {secondaryText}
              </motion.span>
            </Link>
          </Magnetic>
        )}
      </div>
    </motion.div>
  )
}
