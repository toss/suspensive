import type { ReactNode } from 'react'

export const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-md text-center font-bold opacity-60 md:text-2xl">
    {children}
  </h3>
)
export const SectionDescription = ({ children }: { children: ReactNode }) => (
  <h4 className="text-center text-2xl font-bold md:text-4xl">{children}</h4>
)
