import { type InViewOptions, useInView } from './useInView'

interface InViewProps extends InViewOptions {
  children: (inViewResult: ReturnType<typeof useInView>) => React.ReactNode
}

export function InView({ children, ...options }: InViewProps) {
  return <>{children(useInView(options))}</>
}
