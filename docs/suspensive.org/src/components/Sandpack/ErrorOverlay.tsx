import {
  ErrorOverlay as SandpackErrorOverlay,
  useErrorMessage,
} from '@codesandbox/sandpack-react'

export const ErrorOverlay = () => {
  const errorMessage = useErrorMessage()

  // https://github.com/codesandbox/sandpack/blob/main/sandpack-react/src/components/common/ErrorOverlay.tsx#L54-L55
  const isSandpackBundlerError = errorMessage?.startsWith('[sandpack-client]')
  const privateDependencyError = errorMessage?.includes(
    'NPM_REGISTRY_UNAUTHENTICATED_REQUEST'
  )

  if (privateDependencyError || (isSandpackBundlerError && errorMessage)) {
    return <SandpackErrorOverlay />
  }

  return null
}
