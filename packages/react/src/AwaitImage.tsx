import { type ReactNode, use } from 'react'

// TODO: implement cache value
const imageCache = new Map<string, Promise<HTMLImageElement>>()

function preloadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src)
  if (cached) return cached

  const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => {
      imageCache.delete(src)
      reject(new Error(`Failed to load image: ${src}`))
    }
    img.src = src
  })

  imageCache.set(src, imageLoadPromise)
  return imageLoadPromise
}

export function AwaitImage({ src, children }: { src: string; children: (img: HTMLImageElement) => ReactNode }) {
  const img = use(preloadImage(src))
  return <>{children(img)}</>
}
