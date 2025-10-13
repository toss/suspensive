import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useTheme } from 'nextra-theme-docs'
import { useState } from 'react'
import checkSVG from '../../public/img/icons/check.svg'
import checkBlackSVG from '../../public/img/icons/check_black.svg'
import content_copySVG from '../../public/img/icons/content_copy.svg'
import content_copyBlackSVG from '../../public/img/icons/content_copy_black.svg'

const npmInstallScript = 'npm i @suspensive/react'
export const NpmInstallCopyButton = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const { theme } = useTheme()

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
              <Image
                src={
                  theme === 'dark'
                    ? isChecked
                      ? checkSVG
                      : content_copySVG
                    : isChecked
                      ? checkBlackSVG
                      : content_copyBlackSVG
                }
                alt="svg"
                className="object-contain"
              />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  )
}
