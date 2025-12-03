import {
  type CodeEditorProps,
  type PreviewProps,
  type SandpackLayoutProps,
  SandpackProvider,
  type SandpackProviderProps,
} from '@codesandbox/sandpack-react'
import { baseTemplate } from './baseTemplate'
import { CustomPreset } from './CustomPreset'

interface SandpackProps extends Omit<
  SandpackProviderProps,
  'template' | 'customSetup' | 'options'
> {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  providerOptions?: SandpackProviderProps
  layoutOptions?: SandpackLayoutProps
  editorOptions?: CodeEditorProps
  previewOptions?: PreviewProps & {
    showConsole?: boolean
    showConsoleButton?: boolean
    layout?: 'preview' | 'tests' | 'console'
  }
}

export const Sandpack = (props: SandpackProps) => {
  return (
    <SandpackProvider
      template="react-ts"
      theme={{
        colors: { surface1: '#000000', surface2: '#404040' },
        syntax: {
          keyword: '#ff7a70',
          definition: '#8dff97',
          tag: '#7BE183',
          string: '#a4d6fe',
          static: '#a4d6fe',
          property: '#78BEFD',
        },
      }}
      {...props}
      files={{
        ...baseTemplate.files,
        ...(props.files || {}),
      }}
      customSetup={{
        dependencies: {
          ...baseTemplate.dependencies,
          ...props.dependencies,
        },
        devDependencies: {
          ...baseTemplate.devDependencies,
          ...props.devDependencies,
        },
      }}
      options={{
        initMode: 'user-visible',
        initModeObserverOptions: { rootMargin: '1400px 0px' },
        ...props.providerOptions,
      }}
    >
      <CustomPreset
        layoutOptions={props.layoutOptions}
        editorOptions={{ ...props.editorOptions, showLineNumbers: false }}
        previewOptions={props.previewOptions}
      />
    </SandpackProvider>
  )
}
