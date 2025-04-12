import { type InViewOptions, useInView } from './useInView'

interface InViewProps extends InViewOptions {
  children: (inViewResult: ReturnType<typeof useInView>) => React.ReactNode
  onInView?: (entry: IntersectionObserverEntry) => void
  onInViewEnd?: (entry: IntersectionObserverEntry) => void
}

export function InView({ children, ...options }: InViewProps) {
  return (
    <>
      {children(
        useInView({
          ...options,
          onChange: (inView, entry) => {
            options.onChange?.(inView, entry)
            if (inView) {
              options.onInView?.(entry)
            } else {
              options.onInViewEnd?.(entry)
            }
          },
        })
      )}
    </>
  )
}
