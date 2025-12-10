import type { ReactNode } from 'react'
import { useSuspenseImage } from './useSuspenseImage'

export interface SuspenseImageProps {
  src: string
  children: (img: HTMLImageElement) => ReactNode
}

export function SuspenseImage({ src, children }: SuspenseImageProps) {
  return <>{children(useSuspenseImage(src))}</>
}
