import type { ReactNode } from 'react'

export const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="text-md text-center font-bold opacity-60 md:text-2xl">
    {children}
  </h2>
)
export const SectionDescription = ({ children }: { children: ReactNode }) => (
  <p className="text-center text-2xl font-bold md:text-4xl">{children}</p>
)
