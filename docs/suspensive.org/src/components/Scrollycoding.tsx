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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return getStartingSnapshot(this.ref.current!)
  }

  componentDidUpdate(
    prevProps: never,
    prevState: never,
    snapshot: TokenTransitionsSnapshot
  ) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const transitions = calculateTransitions(this.ref.current!, snapshot)
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
    <SelectionProvider className="my-4 mb-24 flex gap-4">
      <div className="mb-[40vh]" style={{ flex: 1 }}>
        {steps.map((step, i) => (
          <Selectable
            key={i}
            index={i}
            selectOn={['click', 'scroll']}
            className="mb-56 cursor-pointer px-5 py-2 opacity-30 blur-lg transition data-[selected=true]:opacity-100 data-[selected=true]:blur-none"
          >
            <h2 className="mb-4 mt-4 text-lg font-bold lg:text-2xl">
              {step.title}
            </h2>
            <div className="opacity-90">{step.children}</div>
          </Selectable>
        ))}
      </div>

      <div
        className="rounded-xl border-2 border-[#ffffff10] bg-[#191919]"
        style={{ flex: 2 }}
      >
        <div className="sticky top-16 overflow-auto">
          <Selection
            from={steps.map((step) => (
              // eslint-disable-next-line @eslint-react/no-duplicate-key
              <Code key="this key should be same" codeblock={step.code} />
            ))}
          />
        </div>
      </div>
    </SelectionProvider>
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
