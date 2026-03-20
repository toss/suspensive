'use client'

import { motion } from 'motion/react'
import { useMemo } from 'react'

export function GlowEffect() {
  const background = useMemo(
    () =>
      ['#FF5733', '#33FF57', '#3357FF', '#F1C40F'].map(
        (color, index, colors) =>
          `conic-gradient(from 0deg at 50% 50%, ${color} 0%, ${colors[(index + 1) % colors.length]} 50%, ${color} 100%)`
      ),
    []
  )
  return (
    <motion.div
      style={
        {
          '--scale': 1.02,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        } as React.CSSProperties
      }
      animate={{
        background,
        transition: {
          repeat: Infinity,
          duration: 5,
          ease: 'linear',
          repeatType: 'mirror',
        },
      }}
      className={
        'pointer-events-none absolute inset-0 h-full w-full scale-[var(--scale)] transform-gpu blur-sm'
      }
    />
  )
}
