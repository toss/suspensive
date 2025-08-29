import Image from 'next/image'

export const LogoImage = ({ size = 1 }: { size: number }) => {
  const baseWidth = 330 * size
  const baseHeight = 43.7 * size

  return (
    <Image
      width={baseWidth}
      height={baseHeight}
      src="/img/logo-suspensive-text-progressive-blur.svg"
      unoptimized
      alt="Suspensive with star"
      className="h-auto w-full"
      style={{
        width: `clamp(0px, ${baseWidth}px, calc(100% - 24px))`,
      }}
    />
  )
}
