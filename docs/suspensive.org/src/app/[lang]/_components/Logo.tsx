'use client'

import { motion } from 'motion/react'
import Image from 'next/image'

export const Logo = () => {
  return (
    <motion.div>
      <div className="relative flex items-center gap-1">
        <Image
          width={36}
          height={36}
          src="/img/logo-suspensive-progressive-blur.svg"
          unoptimized
          alt="suspensive logo"
        />
        <span className="absolute -top-1 -right-3 text-[8px]">v3</span>
      </div>
    </motion.div>
  )
}
