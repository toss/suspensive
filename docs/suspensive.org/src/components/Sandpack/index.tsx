import { Sandpack as SandpackReact } from '@codesandbox/sandpack-react'
import { atomDark } from '@codesandbox/sandpack-themes'
import type { ComponentProps } from 'react'

export const Sandpack = (props: Omit<ComponentProps<typeof SandpackReact>, 'template'>) => {
  return (
    <SandpackReact
      template="vite-react-ts"
      theme={atomDark}
      {...props}
      options={{
        showLineNumbers: true,
        showTabs: true,
        showRefreshButton: true,
        ...props.options,
      }}
    />
  )
}
