'use client'

import { getSandpackCssText } from '@codesandbox/sandpack-react'

export const SandPackCSS = () => {
  return (
    <style
      dangerouslySetInnerHTML={{ __html: getSandpackCssText() }}
      id="sandpack"
      key="sandpack-css"
    />
  )
}
