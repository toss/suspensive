import { Component, createElement } from 'react'
import { observe } from './observe'
import type { IntersectionObserverProps, PlainChildrenProps } from './types'

export class InView extends Component<
  IntersectionObserverProps | PlainChildrenProps,
  { inView: boolean; entry?: IntersectionObserverEntry }
> {
  node: Element | null = null
  _unobserveCb: (() => void) | null = null

  constructor(props: IntersectionObserverProps | PlainChildrenProps) {
    super(props)
    this.state = {
      inView: !!props.initialInView,
      entry: undefined,
    }
  }

  componentDidMount() {
    this.unobserve()
    this.observeNode()
  }

  componentDidUpdate(prevProps: IntersectionObserverProps) {
    // If a IntersectionObserver option changed, reinit the observer
    if (
      prevProps.rootMargin !== this.props.rootMargin ||
      prevProps.root !== this.props.root ||
      prevProps.threshold !== this.props.threshold ||
      prevProps.skip !== this.props.skip ||
      prevProps.trackVisibility !== this.props.trackVisibility ||
      prevProps.delay !== this.props.delay
    ) {
      this.unobserve()
      this.observeNode()
    }
  }

  componentWillUnmount() {
    this.unobserve()
  }

  observeNode() {
    if (!this.node || this.props.skip) return
    const { threshold, root, rootMargin, trackVisibility, delay, fallbackInView } = this.props

    this._unobserveCb = observe(
      this.node,
      this.handleChange,
      {
        threshold,
        root,
        rootMargin,
        trackVisibility,
        delay,
      },
      fallbackInView
    )
  }

  unobserve() {
    if (this._unobserveCb) {
      this._unobserveCb()
      this._unobserveCb = null
    }
  }

  handleNode = (node?: Element | null) => {
    if (this.node) {
      // Clear the old observer, before we start observing a new element
      this.unobserve()

      if (!node && !this.props.triggerOnce && !this.props.skip) {
        // Reset the state if we get a new node, and we aren't ignoring updates
        this.setState({ inView: !!this.props.initialInView, entry: undefined })
      }
    }

    this.node = node ? node : null
    this.observeNode()
  }

  handleChange = (inView: boolean, entry: IntersectionObserverEntry) => {
    if (inView && this.props.triggerOnce) {
      // If `triggerOnce` is true, we should stop observing the element.
      this.unobserve()
    }
    if (this.props.children === 'function') {
      // Store the current State, so we can pass it to the children in the next render update
      // There's no reason to update the state for plain children, since it's not used in the rendering.
      this.setState({ inView, entry })
    }
    if (this.props.onChange) {
      // If the user is actively listening for onChange, always trigger it
      this.props.onChange(inView, entry)
    }
  }

  render() {
    const { children } = this.props
    if (typeof children === 'function') {
      const { inView, entry } = this.state
      return children({ inView, entry, ref: this.handleNode })
    }

    const {
      as,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      triggerOnce,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      threshold,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      root,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      rootMargin,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onChange,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      skip,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      trackVisibility,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      delay,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      initialInView,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      fallbackInView,
      ...props
    } = this.props as PlainChildrenProps

    return createElement(as || 'div', { ref: this.handleNode, ...props }, children)
  }
}
