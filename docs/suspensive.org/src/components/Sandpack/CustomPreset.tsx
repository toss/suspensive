'use client'

import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  SandpackStack,
  SandpackTests,
} from '@codesandbox/sandpack-react'
import {
  type ComponentProps,
  Fragment,
  useEffect,
  useRef,
  useState,
} from 'react'
import { ConsoleCounterButton } from './ConsoleCounterButton'
import { ErrorOverlay } from './ErrorOverlay'
import type { Sandpack } from '.'

export const CustomPreset = (
  props: Pick<
    ComponentProps<typeof Sandpack>,
    'layoutOptions' | 'editorOptions' | 'previewOptions'
  >
) => {
  const dragEventTargetRef = useRef<(EventTarget & HTMLDivElement) | null>(null)

  const [horizontalSize, setHorizontalSize] = useState(50)
  const [verticalSize, setVerticalSize] = useState(60)
  const [consoleVisibility, setConsoleVisibility] = useState(
    props.previewOptions?.showConsole ?? false
  )
  const [counter, setCounter] = useState(0)

  const mode = props.previewOptions?.layout ?? 'preview'
  const showConsole = props.previewOptions?.showConsole ?? false
  const showConsoleButton = props.previewOptions?.showConsoleButton ?? false

  const hasRightColumn = showConsole || showConsoleButton
  const RightColumn = hasRightColumn ? SandpackStack : Fragment

  const rightColumnStyle = {
    flexGrow: 100 - horizontalSize,
    flexShrink: 100 - horizontalSize,
    flexBasis: 0,
    width: `${100 - horizontalSize}%`,
    height: 400,
    gap: consoleVisibility ? 1 : 0,
  }

  const rightColumnProps = hasRightColumn
    ? { className: 'sb-preset-column', style: rightColumnStyle }
    : {}

  const topRowStyle = hasRightColumn
    ? {
        flexGrow: verticalSize,
        flexShrink: verticalSize,
        flexBasis: 0,
        overflow: 'hidden',
        height: 400,
      }
    : rightColumnStyle

  const actionsChildren = showConsoleButton ? (
    <ConsoleCounterButton
      counter={counter}
      onClick={() => setConsoleVisibility((prev) => !prev)}
    />
  ) : undefined

  const onDragMove = (event: MouseEvent) => {
    if (!dragEventTargetRef.current) return

    const container = dragEventTargetRef.current.parentElement

    if (!container) return

    const direction = dragEventTargetRef.current.dataset.direction as
      | 'horizontal'
      | 'vertical'
    const isHorizontal = direction === 'horizontal'

    const { left, top, height, width } = container.getBoundingClientRect()
    const offset = isHorizontal
      ? ((event.clientX - left) / width) * 100
      : ((event.clientY - top) / height) * 100
    const boundaries = Math.min(Math.max(offset, 25), 75)

    if (isHorizontal) {
      setHorizontalSize(boundaries)
    } else {
      setVerticalSize(boundaries)
    }

    container.querySelectorAll(`.sp-stack`).forEach((item: HTMLDivElement) => {
      item.style.pointerEvents = 'none'
    })
  }

  const stopDragging = () => {
    const container = dragEventTargetRef.current?.parentElement

    if (!container) return

    container.querySelectorAll(`.sp-stack`).forEach((item: HTMLDivElement) => {
      item.style.pointerEvents = ''
    })

    dragEventTargetRef.current = null
  }

  useEffect(() => {
    document.body.addEventListener('mousemove', onDragMove)
    document.body.addEventListener('mouseup', stopDragging)

    return () => {
      document.body.removeEventListener('mousemove', onDragMove)
      document.body.removeEventListener('mouseup', stopDragging)
    }
  }, [])

  return (
    <SandpackLayout {...props.layoutOptions}>
      <SandpackCodeEditor
        showLineNumbers
        showInlineErrors
        showTabs
        showRunButton={false}
        style={{
          flexGrow: horizontalSize,
          flexShrink: horizontalSize,
          flexBasis: 0,
          overflow: 'hidden',
          height: 400,
        }}
        {...props.editorOptions}
      />
      <div
        className="sp-resize-handler absolute top-0 bottom-0 z-[3] hidden w-[10px] cursor-ew-resize md:block"
        data-direction="horizontal"
        onMouseDown={(event) => {
          dragEventTargetRef.current = event.currentTarget
        }}
        style={{ left: `calc(${horizontalSize}% - 5px)` }}
      />
      <RightColumn {...rightColumnProps}>
        {mode === 'preview' && (
          <SandpackPreview
            showSandpackErrorOverlay={false}
            actionsChildren={actionsChildren}
            style={topRowStyle}
            {...props.previewOptions}
          >
            <ErrorOverlay />
          </SandpackPreview>
        )}
        {mode === 'tests' && (
          <SandpackTests
            actionsChildren={actionsChildren}
            style={topRowStyle}
          />
        )}
        {mode === 'console' && (
          <SandpackConsole
            actionsChildren={actionsChildren}
            style={topRowStyle}
            standalone
          />
        )}

        {(showConsoleButton || consoleVisibility) && (
          <>
            {consoleVisibility && (
              <div
                className="sp-resize-handler absolute right-0 left-0 z-[3] hidden h-[10px] cursor-ns-resize select-none md:block"
                data-direction="vertical"
                onMouseDown={(event): void => {
                  dragEventTargetRef.current = event.currentTarget
                }}
                style={{ top: `calc(${verticalSize}% - 5px)` }}
              />
            )}

            <div
              className="sp-console-wrapper w-full overflow-hidden"
              style={{
                flexGrow: consoleVisibility ? 100 - verticalSize : 0,
                flexShrink: consoleVisibility ? 100 - verticalSize : 0,
                flexBasis: 0,
              }}
            >
              <SandpackConsole
                onLogsChange={(logs) => setCounter(logs.length)}
                showHeader={false}
              />
            </div>
          </>
        )}
      </RightColumn>
    </SandpackLayout>
  )
}
