'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface HeroLogoInViewContextValue {
  isHeroLogoInView: boolean
  setIsHeroLogoInView: (inView: boolean) => void
}

const HeroLogoInViewContext = createContext<HeroLogoInViewContextValue | null>(
  null
)

HeroLogoInViewContext.displayName = 'HeroLogoInViewContext'

export const HeroLogoInViewProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [isHeroLogoInView, setIsHeroLogoInView] = useState(true)

  return (
    <HeroLogoInViewContext.Provider
      value={{ isHeroLogoInView, setIsHeroLogoInView }}
    >
      {children}
    </HeroLogoInViewContext.Provider>
  )
}

export const useHeroLogoInView = () => {
  const context = useContext(HeroLogoInViewContext)
  if (!context) {
    throw new Error(
      'useHeroLogoInView must be used within a HeroLogoInViewProvider'
    )
  }
  return context
}
