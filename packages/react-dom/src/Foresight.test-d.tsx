import { expectType } from 'vitest'
import { Foresight } from './Foresight'
import { type UseForesightResult } from './useForesight'

describe('Foresight types', () => {
  it('should have correct prop types', () => {
    const component = (
      <Foresight
        callback={() => {}}
        name="test"
        hitSlop={10}
        meta={{ key: 'value' }}
        reactivateAfter={1000}
        autoInitialize={true}
        disabled={false}
      >
        {(result) => {
          expectType<UseForesightResult>(result)
          return <button ref={result.ref}>Test</button>
        }}
      </Foresight>
    )

    expectType<JSX.Element>(component)
  })

  it('should work with minimal props', () => {
    const component = (
      <Foresight callback={() => {}}>
        {({ ref, isRegistered }) => (
          <button ref={ref} data-registered={isRegistered}>
            Test
          </button>
        )}
      </Foresight>
    )

    expectType<JSX.Element>(component)
  })
})
