'use client'
import { clsx } from 'clsx'
import { motion } from 'motion/react'
import React from 'react'

export const TextShimmer = React.memo(function TextShimmer({
  children,
  duration = 2,
  spread = 2,
}: {
  children: string
  duration?: number
  spread?: number
}) {
  return (
    <motion.p
      className={clsx(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent [--base-color:#c4c4d2] [--base-gradient-color:#000]',
        '[background-repeat:no-repeat,padding-box] [--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]',
        'dark:[--base-color:#afafaf] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]'
      )}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
        repeatDelay: 1,
      }}
      style={
        {
          '--spread': `${children.length * spread}px`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
    >
      {children}
    </motion.p>
  )
})
