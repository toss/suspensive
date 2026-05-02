'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface HeroLogoInViewContextValue {
  isHeroLogoInView: boolean
  setIsHeroLogoInView: (inView: boolean) => void
}

const HeroLogoInViewContext = createContext<HeroLogoInViewContextValue>({
  isHeroLogoInView: true,
  setIsHeroLogoInView: () => {},
})

export const HeroLogoInViewProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [isHeroLogoInView, setIsHeroLogoInView] = useState(true)

  return (
    <HeroLogoInViewContext value={{ isHeroLogoInView, setIsHeroLogoInView }}>
      {children}
    </HeroLogoInViewContext>
  )
}

export const useHeroLogoInView = () => useContext(HeroLogoInViewContext)
