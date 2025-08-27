import Image from 'next/image'

export const LogoImage = ({ size = 1 }: { size: number }) => (
  <Image
    width={330 * size}
    height={43.7 * size}
    src="/img/logo-suspensive-text-progressive-blur.svg"
    unoptimized
    alt="Suspensive with star"
  />
)
