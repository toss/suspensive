import type { ReactNode } from 'react'

export type StepsProps = {
  children: ReactNode
}

export function Steps({ children }: StepsProps) {
  return (
    <div className="steps my-6 ml-4 border-l border-gray-200 pl-6 [counter-reset:step] dark:border-gray-800">
      {children}
    </div>
  )
}
