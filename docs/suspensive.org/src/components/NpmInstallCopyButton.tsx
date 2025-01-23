import { AnimatePresence, motion } from 'motion/react'
import '../styles/globals.css'
import Image from 'next/image'
import { useState } from 'react'
import checkSVG from '../../public/img/icons/check.svg'
import content_copySVG from '../../public/img/icons/content_copy.svg'

const npmInstallScript = 'npm i @suspensive/react'
export const NpmInstallCopyButton = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  return (
    <motion.button
      className="relative mt-4 flex cursor-copy"
      type="button"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false)
        setIsClicked(false)
      }}
      whileHover={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      onClick={() => {
        navigator.clipboard.writeText(npmInstallScript)
        setIsClicked(true)
      }}
    >
      ~ {npmInstallScript}
      <motion.div className="absolute -right-8 flex items-center justify-center">
        <AnimatePresence>
          {isHovered ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Image src={isClicked ? checkSVG : content_copySVG} alt="" />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  )
}
