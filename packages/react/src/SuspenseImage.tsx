import type { ReactNode } from 'react'
import { useIsClient } from './useIsClient'
import { use } from './utils/use'

export interface SuspenseImageProps {
  src: string
  children: (img: HTMLImageElement) => ReactNode
}

/**
 * A component that loads images with Suspense support
 *
 * @experimental This is experimental feature.
 *
 * @description
 * SuspenseImage loads an image asynchronously and suspends rendering until the image is loaded.
 * The component uses an internal cache to avoid reloading the same image multiple times.
 * In SSR environments, it returns a mock object immediately to ensure the image tag is included in the server-rendered HTML.
 *
 * @example
 * ```tsx
 * import { SuspenseImage, Suspense } from '@suspensive/react'
 *
 * function ImageExample() {
 *   return (
 *     <Suspense fallback={<div>Loading image...</div>}>
 *       <SuspenseImage src="https://example.com/image.jpg">
 *         {(img) => <img src={img.src} alt="Example" />}
 *       </SuspenseImage>
 *     </Suspense>
 *   )
 * }
 * ```
 */
export function SuspenseImage({ src, children }: SuspenseImageProps) {
  return <>{children(useSuspenseImage(src))}</>
}

const imageCache = new Map<string, Promise<HTMLImageElement>>()

/**
 * Use clearImageCache only internally.
 * @private
 */
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

/**
 * A hook that loads an image with Suspense support
 *
 * @experimental This is experimental feature.
 *
 * @description
 * useSuspenseImage loads an image asynchronously and suspends the component until the image is loaded.
 * The hook uses an internal cache to avoid reloading the same image multiple times.
 * In SSR environments, it returns a mock object immediately to ensure the image tag is included in the server-rendered HTML.
 *
 * @example
 * ```tsx
 * import { useSuspenseImage, Suspense } from '@suspensive/react'
 *
 * function ImageComponent() {
 *   const img = useSuspenseImage('https://example.com/image.jpg')
 *
 *   return <img src={img.src} alt="Example" />
 * }
 *
 * function App() {
 *   return (
 *     <Suspense fallback={<div>Loading image...</div>}>
 *       <ImageComponent />
 *     </Suspense>
 *   )
 * }
 * ```
 *
 * @param src - The source URL of the image to load
 * @returns The loaded HTMLImageElement. In SSR, returns a mock object with the src property.
 */
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
