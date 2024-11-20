import { FadeIn } from './FadeIn'

describe('<FadeIn/>', () => {
  // eslint-disable-next-line vitest/expect-expect
  it('type check', () => {
    // @ts-expect-error ts(2322)
    ;(() => <FadeIn as="div" href="https://example.com"></FadeIn>)()
    ;(() => <FadeIn as="a" href="https://example.com"></FadeIn>)()
    ;(() => <FadeIn></FadeIn>)()
    ;(() => <FadeIn as={Example1} x="string"></FadeIn>)()
    // @ts-expect-error ts(2322)
    ;(() => <FadeIn as={Example2} x="string"></FadeIn>)()
    // @ts-expect-error ts(2353)
    ;(() => <FadeIn style={{ opacity: 1 }}></FadeIn>)()
  })
})

const Example1 = ({}: { x: string }) => <></>
const Example2 = () => <></>
