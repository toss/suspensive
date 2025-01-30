'use client'

import { motion } from 'motion/react'
import Image from 'next/image'

export const Logo = () => {
  return (
    <motion.div
      className="flex items-center gap-1"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span>
        <Image
          src="/img/logo_dark.png"
          width={34}
          height={34}
          alt="suspensive logo"
        />
      </motion.span>
      <div className="relative">
        <strong>Suspensive</strong>
        <span className="absolute text-[8px]">v2</span>
      </div>
    </motion.div>
  )
}
