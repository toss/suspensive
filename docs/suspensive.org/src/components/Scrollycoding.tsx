'use client'

import { Block, HighlightedCodeBlock, parseProps } from 'codehike/blocks'
import {
  type AnnotationHandler,
  type CustomPreProps,
  type HighlightedCode,
  InnerLine,
  InnerPre,
  InnerToken,
  Pre,
  getPreRef,
} from 'codehike/code'
import {
  Selectable,
  Selection,
  SelectionProvider,
} from 'codehike/utils/selection'
import {
  type TokenTransitionsSnapshot,
  calculateTransitions,
  getStartingSnapshot,
} from 'codehike/utils/token-transitions'
import { Component, type RefObject } from 'react'
import { z } from 'zod'

const MAX_TRANSITION_DURATION = 900 // milliseconds

export class SmoothPre extends Component<CustomPreProps> {
  ref: RefObject<HTMLPreElement>
  constructor(props: CustomPreProps) {
    super(props)
    this.ref = getPreRef(this.props)
  }

  render() {
    return <InnerPre merge={this.props} style={{ position: 'relative' }} />
  }

  getSnapshotBeforeUpdate() {
    return getStartingSnapshot(this.ref.current)
  }

  componentDidUpdate(
    prevProps: never,
    prevState: never,
    snapshot: TokenTransitionsSnapshot
  ) {
    const transitions = calculateTransitions(this.ref.current, snapshot)
    transitions.forEach(({ element, keyframes, options }) => {
      const { translateX, translateY, ...kf } = keyframes as any
      if (translateX && translateY) {
        kf.translate = [
          `${translateX[0]}px ${translateY[0]}px`,
          `${translateX[1]}px ${translateY[1]}px`,
        ]
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      element.animate(kf, {
        duration: options.duration * MAX_TRANSITION_DURATION,
        delay: options.delay * MAX_TRANSITION_DURATION,
        easing: options.easing,
        fill: 'both',
      })
    })
  }
}

const Schema = Block.extend({
  steps: z.array(Block.extend({ code: HighlightedCodeBlock })),
})

export function Scrollycoding(props: unknown) {
  const { steps } = parseProps(props, Schema)
  return (
    <>
      {/* only in desktop */}
      <SelectionProvider className="my-4 mb-24 hidden gap-4 md:flex">
        <div className="mb-[40vh]" style={{ flex: 1 }}>
          {steps.map((step, i) => (
            <Selectable
              key={i}
              index={i}
              selectOn={['click', 'scroll']}
              className="mb-56 cursor-pointer px-5 py-2 opacity-30 blur-lg transition data-[selected=true]:opacity-100 data-[selected=true]:blur-none"
            >
              <h2 className="2xl mt-4 mb-4 text-lg font-bold">{step.title}</h2>
              <div className="opacity-75">{step.children}</div>
            </Selectable>
          ))}
        </div>

        <div
          className="rounded-xl border-2 border-[#ffffff08] bg-[#ffffff04]"
          style={{ flex: 2 }}
        >
          <div className="scrollbar-none sticky top-16 overflow-auto">
            <Selection
              from={steps.map((step) => (
                <Code
                  // eslint-disable-next-line @eslint-react/no-duplicate-key
                  key="this key should be same desktop"
                  codeblock={step.code}
                />
              ))}
            />
          </div>
        </div>
      </SelectionProvider>
      {/* only in mobile */}
      <SelectionProvider className="my-4 mb-24 flex gap-2 md:hidden">
        <div className="mb-[40vh]" style={{ flex: 1 }}>
          {steps.map((step, i) => (
            <Selectable
              key={i}
              index={i}
              selectOn={['click', 'scroll']}
              className="mb-20 cursor-pointer py-2 opacity-30 blur-lg transition data-[selected=true]:opacity-100 data-[selected=true]:blur-none"
            >
              <h2 className="mb-2 text-sm font-bold">{step.title}</h2>
              <div className="text-sm opacity-75">{step.children}</div>
            </Selectable>
          ))}
        </div>
        <div className="-mr-6 rounded-xl" style={{ flex: 2 }}>
          <div className="scrollbar-none sticky top-28 overflow-auto">
            <Selection
              from={steps.map((step) => (
                <CodeMobile
                  // eslint-disable-next-line @eslint-react/no-duplicate-key
                  key="this key should be same mobile"
                  codeblock={step.code}
                />
              ))}
            />
          </div>
        </div>
      </SelectionProvider>
    </>
  )
}

const tokenTransitions: AnnotationHandler = {
  name: 'token-transitions',
  PreWithRef: SmoothPre,
  Token: (props) => (
    <InnerToken merge={props} style={{ display: 'inline-block' }} />
  ),
}
const wordWrap: AnnotationHandler = {
  name: 'word-wrap',
  Pre: (props) => <InnerPre merge={props} className="whitespace-pre-wrap" />,
  Line: (props) => (
    <InnerLine
      merge={props}
      style={{
        textIndent: `${-props.indentation}ch`,
        marginLeft: `${props.indentation}ch`,
      }}
    />
  ),
  Token: (props) => <InnerToken merge={props} style={{ textIndent: 0 }} />,
}
function Code({ codeblock }: { codeblock: HighlightedCode }) {
  return (
    <Pre
      code={codeblock}
      handlers={[tokenTransitions, wordWrap]}
      className="min-h-[40rem] p-6"
    />
  )
}

const tokenTransitionsMobile: AnnotationHandler = {
  name: 'token-transitions',
  PreWithRef: SmoothPre,
  Token: (props) => (
    <InnerToken merge={props} style={{ display: 'inline-block' }} />
  ),
}
const wordWrapMobile: AnnotationHandler = {
  name: 'word-wrap',
  Pre: (props) => <InnerPre merge={props} className="whitespace-pre-wrap" />,
  Line: (props) => (
    <InnerLine
      merge={props}
      style={{
        fontSize: '0.5rem',
        textIndent: `${-props.indentation}ch`,
        marginLeft: `${props.indentation}ch`,
      }}
    />
  ),
  Token: (props) => <InnerToken merge={props} style={{ textIndent: 0 }} />,
}
function CodeMobile({ codeblock }: { codeblock: HighlightedCode }) {
  return (
    <Pre
      code={codeblock}
      handlers={[tokenTransitionsMobile, wordWrapMobile]}
      className="min-h-[40rem] p-2"
    />
  )
}
