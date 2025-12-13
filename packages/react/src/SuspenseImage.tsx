import type { ReactNode } from 'react'
import { useIsClient } from './useIsClient'
import { use } from './utils/use'

export interface SuspenseImageProps {
  src: string
  children: (img: HTMLImageElement) => ReactNode
}

export function SuspenseImage({ src, children }: SuspenseImageProps) {
  return <>{children(useSuspenseImage(src))}</>
}

const imageCache = new Map<string, Promise<HTMLImageElement>>()

export function clearImageCache() {
  imageCache.clear()
}

function preloadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src)
  if (cached) {
    return cached
  }

  const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.src = src

    // if the image is already loaded in the browser
    if (img.complete && img.naturalWidth > 0) {
      resolve(img)
      return
    }

    img.onload = () => resolve(img)
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`))
    }
  })

  imageCache.set(src, imageLoadPromise)
  return imageLoadPromise
}

export function useSuspenseImage(src: string): HTMLImageElement {
  const isClient = useIsClient()
  if (!isClient) {
    /**
     * In SSR, return a mock object immediately instead of suspending.
     * This ensures the <img> tag is included in the server-rendered HTML for SEO,
     */
    return { src, complete: false } as HTMLImageElement
  }

  return use(preloadImage(src))
}
