import type { ComponentProps } from 'react'
import { forwardRef } from 'react'
import { useLoad } from './Load'

export const Image = forwardRef<HTMLImageElement, ComponentProps<'img'>>(function Image({ src, ...props }, ref) {
  if (typeof src !== 'string') {
    throw new Error('Image of @suspensive/image requires src')
  }
  const loaded = useLoad({ src })

  return <img ref={ref} src={loaded.src} {...props} />
})
