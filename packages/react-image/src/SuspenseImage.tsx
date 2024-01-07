import { type ComponentProps, forwardRef } from 'react'
import { useLoad } from './Load'

type SuspenseImageProps = ComponentProps<'img'>
export const SuspenseImage = forwardRef<HTMLImageElement, SuspenseImageProps>(function SuspenseImage(
  { src, ...props },
  ref
) {
  if (typeof src !== 'string') {
    throw new Error('Image of @suspensive/react-image requires src')
  }
  const loaded = useLoad({ src })
  return <img ref={ref} src={loaded.src} {...props} />
})
