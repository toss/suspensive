import { type ComponentProps, type ComponentType, createContext, useCallback, useContext, useState } from 'react'
// https://github.com/suspensive/react/pull/203
// https://github.com/TanStack/query/blob/v4/packages/react-query/src/useSyncExternalStore.ts
import { useSyncExternalStore } from 'use-sync-external-store/shim/index.js'
import { Subscribable } from '../models/Subscribable'
import type { Nullable } from '../utility-types'
import { noop } from '../utils'

const getNull = () => null

export const DevModeContext = createContext<Nullable<SuspensiveDevMode>>(null)
if (process.env.NODE_ENV === 'development') {
  DevModeContext.displayName = 'DevModeContext'
}

export const productionSyncDevMode = () => getNull
const developmentSyncDevMode = <TProps extends ComponentProps<ComponentType>>(
  Component: ComponentType<TProps & { devMode: SuspensiveDevMode }>
) => {
  const Wrapped = (props: TProps & { devMode: SuspensiveDevMode }) => {
    const getSnapshot = useCallback(() => props.devMode.is, [props.devMode.is])
    useSyncExternalStore(props.devMode.subscribe, getSnapshot, getSnapshot)
    return <Component {...props} />
  }
  const WrappedWrapped = (props: TProps) => {
    const devMode = useContext(DevModeContext)
    return devMode ? <Wrapped {...props} devMode={devMode} /> : null
  }
  WrappedWrapped.display = `syncDevMode(${Component.displayName})`
  return WrappedWrapped
}
export const syncDevMode = process.env.NODE_ENV === 'development' ? developmentSyncDevMode : productionSyncDevMode

export const SuspensiveDevModeOnInfoText = '[Suspensive] DevMode is now working'

export class SuspensiveDevMode extends Subscribable {
  promise = new Promise(noop)
  is = false
  on = () => {
    this.is = true
    this.promise = new Promise<void>((resolve) => {
      const timeout = setInterval(() => {
        if (this.is) {
          return console.info(SuspensiveDevModeOnInfoText, new Date())
        }
        resolve()
        clearInterval(timeout)
      }, 500)
    })
    this.notify()
  }
  off = () => {
    this.is = false
    this.promise = new Promise(noop)
    this.notify()
  }
  notify = () => this.listeners.forEach((listener) => listener())
}

export const ProductionDevMode = getNull
const devModePosition = {
  bottomLeft: { bottom: 8, left: 8 },
  bottomRight: { bottom: 8, right: 8 },
  topLeft: { top: 8, left: 8 },
  topRight: { top: 8, right: 8 },
} as const
interface DevModeProps {
  position?: keyof typeof devModePosition
}
export const DevelopmentDevMode = syncDevMode<DevModeProps>(({ devMode, position = 'bottomRight' }) => {
  const [isHover, setIsHover] = useState(false)
  return (
    <svg
      role={`Suspensive.DevMode-${devMode.is ? 'on' : 'off'}`}
      onClick={devMode.is ? devMode.off : devMode.on}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        backgroundColor: 'black',
        position: 'fixed',
        border: '1px solid #ffffff60',
        borderRadius: '50%',
        cursor: 'pointer',
        color: 'white',
        fontWeight: 900,
        transition: 'all 200ms',
        ...devModePosition[position],
        opacity: devMode.is ? 1 : isHover ? 0.4 : 0.2,
        transform: isHover ? 'scale(1.1)' : 'scale(1)',
        width: 54,
        height: 54,
      }}
      viewBox="0 0 700 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_997_2)">
        <mask
          id="mask0_997_2"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="169"
          y="120"
          width="341"
          height="450"
        >
          <rect
            x="299.552"
            y="85.5625"
            width="488.634"
            height="190.254"
            rx="95.1269"
            transform="rotate(60 299.552 85.5625)"
            fill="url(#paint0_linear_997_2)"
          />
        </mask>
        <g mask="url(#mask0_997_2)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M421.459 527.094C433.754 531.193 442.837 530.528 449.245 526.828C455.654 523.128 460.772 515.594 463.369 502.897C465.963 490.215 465.759 473.516 462.461 453.688C455.877 414.108 437.321 364.147 408.064 313.474C378.808 262.801 344.819 221.751 313.833 196.259C298.311 183.489 283.952 174.962 271.672 170.868C259.377 166.768 250.294 167.434 243.885 171.134C237.477 174.834 232.359 182.367 229.762 195.064C227.168 207.747 227.372 224.446 230.67 244.273C237.254 283.853 255.81 333.814 285.066 384.487C314.323 435.16 348.312 476.211 379.297 501.703C394.819 514.473 409.179 522.999 421.459 527.094ZM367.105 516.523C333.926 489.226 298.549 446.221 268.447 394.083C238.345 341.944 218.79 289.804 211.74 247.422C208.221 226.268 207.729 207.02 210.961 191.219C214.19 175.432 221.422 161.944 234.29 154.514C247.159 147.085 262.455 147.566 277.742 152.663C293.042 157.764 309.465 167.815 326.026 181.439C359.205 208.735 394.582 251.741 424.684 303.879C454.786 356.017 474.341 408.157 481.391 450.54C484.91 471.694 485.402 490.942 482.17 506.743C478.941 522.53 471.709 536.018 458.841 543.447C445.972 550.877 430.675 550.396 415.389 545.299C400.089 540.197 383.666 530.147 367.105 516.523Z"
            fill="url(#paint1_radial_997_2)"
          />
        </g>
        <g filter="url(#filter1_f_997_2)">
          <mask
            id="mask1_997_2"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="169"
            y="120"
            width="341"
            height="450"
          >
            <rect
              x="379.104"
              y="603.858"
              width="488.634"
              height="190.254"
              rx="95.1269"
              transform="rotate(-120 379.104 603.858)"
              fill="url(#paint2_linear_997_2)"
            />
          </mask>
          <g mask="url(#mask1_997_2)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M421.459 527.094C433.753 531.193 442.836 530.528 449.245 526.828C455.654 523.128 460.771 515.594 463.368 502.897C465.963 490.215 465.758 473.516 462.46 453.688C455.876 414.108 437.32 364.147 408.064 313.474C378.808 262.801 344.819 221.751 313.833 196.259C298.311 183.489 283.952 174.962 271.671 170.868C259.376 166.768 250.294 167.434 243.885 171.134C237.476 174.834 232.359 182.367 229.761 195.064C227.167 207.747 227.372 224.446 230.67 244.273C237.253 283.853 255.81 333.814 285.066 384.487C314.322 435.16 348.311 476.211 379.297 501.703C394.819 514.473 409.178 522.999 421.459 527.094ZM367.105 516.523C333.925 489.226 298.549 446.221 268.446 394.083C238.344 341.944 218.789 289.804 211.739 247.422C208.221 226.268 207.728 207.02 210.96 191.219C214.189 175.432 221.421 161.944 234.29 154.514C247.158 147.085 262.455 147.566 277.741 152.663C293.042 157.764 309.465 167.815 326.025 181.439C359.204 208.735 394.581 251.741 424.683 303.879C454.786 356.017 474.341 408.157 481.39 450.54C484.909 471.694 485.402 490.942 482.17 506.743C478.941 522.53 471.709 536.018 458.84 543.447C445.972 550.877 430.675 550.396 415.389 545.299C400.088 540.197 383.665 530.147 367.105 516.523Z"
              fill="url(#paint3_radial_997_2)"
            />
          </g>
        </g>
        <mask
          id="mask2_997_2"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="109"
          y="249"
          width="490"
          height="191"
        >
          <rect
            x="598.388"
            y="439.839"
            width="488.634"
            height="190.254"
            rx="95.1269"
            transform="rotate(-180 598.388 439.839)"
            fill="url(#paint4_linear_997_2)"
          />
        </mask>
        <g mask="url(#mask2_997_2)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M155.057 324.648C145.359 333.246 141.394 341.445 141.394 348.845C141.394 356.245 145.359 364.444 155.057 373.042C164.743 381.629 179.307 389.802 198.127 396.859C235.696 410.948 288.242 419.858 346.754 419.858C405.266 419.858 457.812 410.948 495.381 396.859C514.201 389.802 528.765 381.629 538.451 373.042C548.149 364.444 552.114 356.245 552.114 348.845C552.114 341.445 548.149 333.246 538.451 324.648C528.765 316.061 514.201 307.888 495.381 300.831C457.812 286.742 405.266 277.832 346.754 277.832C288.242 277.832 235.696 286.742 198.127 300.831C179.307 307.888 164.743 316.061 155.057 324.648ZM191.389 282.862C231.618 267.776 286.55 258.642 346.754 258.642C406.958 258.642 461.89 267.776 502.119 282.862C522.198 290.392 539.114 299.589 551.182 310.289C563.24 320.979 571.304 333.986 571.304 348.845C571.304 363.704 563.24 376.711 551.182 387.401C539.114 398.101 522.198 407.298 502.119 414.828C461.89 429.914 406.958 439.048 346.754 439.048C286.55 439.048 231.618 429.914 191.389 414.828C171.31 407.298 154.394 398.101 142.326 387.401C130.268 376.711 122.204 363.704 122.204 348.845C122.204 333.986 130.268 320.979 142.326 310.289C154.394 299.589 171.31 290.392 191.389 282.862Z"
            fill="url(#paint5_radial_997_2)"
          />
        </g>
        <g filter="url(#filter2_f_997_2)">
          <mask
            id="mask3_997_2"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="109"
            y="249"
            width="490"
            height="191"
          >
            <rect
              x="109.754"
              y="249.585"
              width="488.634"
              height="190.254"
              rx="95.1269"
              fill="url(#paint6_linear_997_2)"
            />
          </mask>
          <g mask="url(#mask3_997_2)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M155.057 324.648C145.359 333.246 141.394 341.445 141.394 348.845C141.394 356.245 145.359 364.444 155.057 373.042C164.743 381.629 179.307 389.802 198.127 396.859C235.696 410.948 288.242 419.858 346.754 419.858C405.266 419.858 457.812 410.948 495.381 396.859C514.201 389.802 528.765 381.629 538.451 373.042C548.149 364.444 552.114 356.245 552.114 348.845C552.114 341.445 548.149 333.246 538.451 324.648C528.765 316.061 514.201 307.888 495.381 300.831C457.812 286.742 405.266 277.832 346.754 277.832C288.242 277.832 235.696 286.742 198.127 300.831C179.307 307.888 164.743 316.061 155.057 324.648ZM191.389 282.862C231.618 267.776 286.55 258.642 346.754 258.642C406.958 258.642 461.89 267.776 502.119 282.862C522.198 290.392 539.114 299.589 551.182 310.289C563.24 320.979 571.304 333.986 571.304 348.845C571.304 363.704 563.24 376.711 551.182 387.401C539.114 398.101 522.198 407.298 502.119 414.828C461.89 429.914 406.958 439.048 346.754 439.048C286.55 439.048 231.618 429.914 191.389 414.828C171.31 407.298 154.394 398.101 142.326 387.401C130.268 376.711 122.204 363.704 122.204 348.845C122.204 333.986 130.268 320.979 142.326 310.289C154.394 299.589 171.31 290.392 191.389 282.862Z"
              fill="url(#paint7_radial_997_2)"
            />
          </g>
        </g>
        <mask
          id="mask4_997_2"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="176"
          y="131"
          width="341"
          height="450"
        >
          <rect
            x="142.158"
            y="519.79"
            width="488.634"
            height="190.254"
            rx="95.1269"
            transform="rotate(-60 142.158 519.79)"
            fill="url(#paint8_linear_997_2)"
          />
        </mask>
        <g mask="url(#mask4_997_2)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M463.582 193.45C460.985 180.753 455.867 173.22 449.459 169.52C443.05 165.82 433.967 165.154 421.672 169.253C409.392 173.348 395.033 181.875 379.511 194.645C348.525 220.136 314.536 261.187 285.28 311.86C256.024 362.533 237.467 412.494 230.884 452.074C227.585 471.902 227.381 488.6 229.975 501.283C232.572 513.98 237.69 521.513 244.099 525.213C250.507 528.914 259.59 529.579 271.885 525.48C284.165 521.385 298.525 512.858 314.047 500.089C345.032 474.597 379.022 433.546 408.278 382.873C437.534 332.2 456.09 282.239 462.674 242.659C465.972 222.831 466.176 206.133 463.582 193.45ZM481.604 245.808C474.554 288.19 454.999 340.33 424.897 392.468C394.795 444.607 359.418 487.612 326.239 514.908C309.678 528.533 293.255 538.583 277.955 543.685C262.669 548.782 247.372 549.262 234.503 541.833C221.635 534.403 214.403 520.915 211.174 505.129C207.942 489.327 208.434 470.079 211.953 448.925C219.003 406.543 238.558 354.403 268.66 302.265C298.762 250.126 334.139 207.121 367.319 179.825C383.879 166.201 400.302 156.15 415.602 151.048C430.889 145.951 446.185 145.471 459.054 152.9C471.922 160.33 479.154 173.818 482.383 189.604C485.616 205.406 485.123 224.654 481.604 245.808Z"
            fill="url(#paint9_radial_997_2)"
          />
        </g>
        <g filter="url(#filter3_f_997_2)">
          <mask
            id="mask5_997_2"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="176"
            y="131"
            width="341"
            height="450"
          >
            <rect
              x="551.24"
              y="191.748"
              width="488.634"
              height="190.254"
              rx="95.127"
              transform="rotate(120 551.24 191.748)"
              fill="url(#paint10_linear_997_2)"
            />
          </mask>
          <g mask="url(#mask5_997_2)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M463.582 193.45C460.985 180.753 455.867 173.22 449.459 169.52C443.05 165.82 433.967 165.154 421.672 169.253C409.392 173.348 395.033 181.875 379.511 194.645C348.525 220.136 314.536 261.187 285.28 311.86C256.024 362.533 237.467 412.494 230.884 452.074C227.585 471.902 227.381 488.6 229.975 501.283C232.572 513.98 237.69 521.513 244.099 525.213C250.507 528.914 259.59 529.579 271.885 525.48C284.165 521.385 298.525 512.858 314.047 500.089C345.032 474.597 379.022 433.546 408.278 382.873C437.534 332.2 456.09 282.239 462.674 242.659C465.972 222.831 466.176 206.133 463.582 193.45ZM481.604 245.808C474.554 288.19 454.999 340.33 424.897 392.468C394.795 444.607 359.418 487.612 326.239 514.908C309.678 528.533 293.255 538.583 277.955 543.685C262.669 548.782 247.372 549.262 234.503 541.833C221.635 534.403 214.403 520.915 211.174 505.129C207.942 489.327 208.434 470.079 211.953 448.925C219.003 406.543 238.558 354.403 268.66 302.265C298.762 250.126 334.139 207.121 367.319 179.825C383.879 166.201 400.302 156.15 415.602 151.048C430.889 145.951 446.185 145.471 459.054 152.9C471.922 160.33 479.154 173.818 482.383 189.604C485.616 205.406 485.123 224.654 481.604 245.808Z"
              fill="url(#paint11_radial_997_2)"
            />
          </g>
        </g>
      </g>
      <g filter="url(#filter4_f_997_2)">
        <circle cx="352.544" cy="347.993" r="34.089" fill="url(#paint12_radial_997_2)" />
      </g>
      <defs>
        <filter
          id="filter0_f_997_2"
          x="112.633"
          y="137.692"
          width="468.243"
          height="420.964"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="4.78554" result="effect1_foregroundBlur_997_2" />
        </filter>
        <filter
          id="filter1_f_997_2"
          x="149.825"
          y="89.9064"
          width="393.479"
          height="518.149"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="29.4853" result="effect1_foregroundBlur_997_2" />
        </filter>
        <filter
          id="filter2_f_997_2"
          x="63.233"
          y="199.671"
          width="567.042"
          height="298.348"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="29.4853" result="effect1_foregroundBlur_997_2" />
        </filter>
        <filter
          id="filter3_f_997_2"
          x="150.039"
          y="88.2921"
          width="393.479"
          height="518.149"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="29.4853" result="effect1_foregroundBlur_997_2" />
        </filter>
        <filter
          id="filter4_f_997_2"
          x="302.413"
          y="297.862"
          width="100.261"
          height="100.261"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="8.02094" result="effect1_foregroundBlur_997_2" />
        </filter>
        <linearGradient
          id="paint0_linear_997_2"
          x1="543.869"
          y1="85.5625"
          x2="543.869"
          y2="275.816"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF0000" />
          <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
        </linearGradient>
        <radialGradient
          id="paint1_radial_997_2"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(278.204 390.65) rotate(-31.2797) scale(159.743 397.66)"
        >
          <stop stopColor="white" stopOpacity="0.4" />
          <stop offset="1" stopColor="white" />
        </radialGradient>
        <linearGradient
          id="paint2_linear_997_2"
          x1="623.421"
          y1="603.858"
          x2="623.421"
          y2="794.112"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF0000" />
          <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
        </linearGradient>
        <radialGradient
          id="paint3_radial_997_2"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(278.203 390.65) rotate(-31.2797) scale(159.743 397.66)"
        >
          <stop stopColor="white" stopOpacity="0.4" />
          <stop offset="1" stopColor="white" />
        </radialGradient>
        <linearGradient
          id="paint4_linear_997_2"
          x1="842.705"
          y1="439.839"
          x2="842.705"
          y2="630.093"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF0000" />
          <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
        </linearGradient>
        <radialGradient
          id="paint5_radial_997_2"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(344.848 268.808) rotate(88.7203) scale(159.743 397.66)"
        >
          <stop stopColor="white" stopOpacity="0.4" />
          <stop offset="1" stopColor="white" />
        </radialGradient>
        <linearGradient
          id="paint6_linear_997_2"
          x1="354.071"
          y1="249.585"
          x2="354.071"
          y2="439.839"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF0000" />
          <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
        </linearGradient>
        <radialGradient
          id="paint7_radial_997_2"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(344.848 268.808) rotate(88.7203) scale(159.743 397.66)"
        >
          <stop stopColor="white" stopOpacity="0.4" />
          <stop offset="1" stopColor="white" />
        </radialGradient>
        <linearGradient
          id="paint8_linear_997_2"
          x1="386.475"
          y1="519.79"
          x2="386.475"
          y2="710.044"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF0000" />
          <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
        </linearGradient>
        <radialGradient
          id="paint9_radial_997_2"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(417.046 385.735) rotate(-151.28) scale(159.743 397.66)"
        >
          <stop stopColor="white" stopOpacity="0.4" />
          <stop offset="1" stopColor="white" />
        </radialGradient>
        <linearGradient
          id="paint10_linear_997_2"
          x1="795.557"
          y1="191.748"
          x2="795.557"
          y2="382.002"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF0000" />
          <stop offset="1" stopColor="#FF0000" stopOpacity="0" />
        </linearGradient>
        <radialGradient
          id="paint11_radial_997_2"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(417.046 385.735) rotate(-151.28) scale(159.743 397.66)"
        >
          <stop stopColor="white" stopOpacity="0.4" />
          <stop offset="1" stopColor="white" />
        </radialGradient>
        <radialGradient
          id="paint12_radial_997_2"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(352.544 347.993) rotate(90) scale(34.089)"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.4" />
        </radialGradient>
      </defs>
    </svg>
  )
})
