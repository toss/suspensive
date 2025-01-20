import { motion } from 'motion/react'

interface Props {
  children: string
}

export function CopyButton({ children }: Props) {
  const handleCopyClick = () => {
    navigator.clipboard.writeText(children)
  }

  return (
    <motion.button
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          delay: 0.8,
          duration: 2,
        },
        filter:
          'drop-shadow(0 0 1px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 3px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',
      }}
      type="button"
      onClick={handleCopyClick}
      className="flex items-center gap-2 rounded-xl border px-7 py-2 before:content-['$'] md:px-10 md:py-3"
    >
      {children}
    </motion.button>
  )
}
