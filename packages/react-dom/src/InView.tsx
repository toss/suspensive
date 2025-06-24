import { type InViewOptions, useInView } from './useInView'

interface InViewProps extends InViewOptions {
  children: (inViewResult: ReturnType<typeof useInView>) => React.ReactNode
}

/**
 * This component uses the IntersectionObserver API to determine when its children enter the viewport.
 * @see {@link https://suspensive.org/docs/react-dom/InView Suspensive Docs}
 */
export function InView({ children, ...options }: InViewProps) {
  return <>{children(useInView(options))}</>
}
