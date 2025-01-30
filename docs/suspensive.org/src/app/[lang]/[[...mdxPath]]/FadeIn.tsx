'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export const FadeIn = ({ children }: { children: ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
    {children}
  </motion.div>
)
