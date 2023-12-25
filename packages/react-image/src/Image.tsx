import { type ComponentProps, forwardRef } from 'react'
import { useLoad } from './Load'

type ImageProps = ComponentProps<'img'>
export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image({ src, ...props }, ref) {
  if (typeof src !== 'string') {
    throw new Error('Image of @suspensive/react-image requires src')
  }
  const loaded = useLoad({ src })
  return <img ref={ref} src={loaded.src} {...props} />
})
