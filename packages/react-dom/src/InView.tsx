import { type InViewOptions, type InViewResult, useInView } from './useInView'

interface InViewProps extends InViewOptions {
  children: (inViewResult: InViewResult) => React.ReactNode
}

export function InView({ children, ...options }: InViewProps) {
  return <>{children(useInView(options))}</>
}
