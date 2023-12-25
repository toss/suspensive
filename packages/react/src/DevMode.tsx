import { useState } from 'react'
import { useDevModeObserve } from './contexts'

const Position = {
  bottomLeft: { bottom: 20, left: 20 },
  bottomRight: { bottom: 20, right: 20 },
  topLeft: { top: 20, left: 20 },
  topRight: { top: 20, right: 20 },
} as const
interface DevModeProps {
  /**
   * @experimental This is experimental feature.
   */
  position?: keyof typeof Position
}
/**
 * @experimental This is experimental feature.
 */
export const DevMode = ({ position = 'bottomRight' }: DevModeProps) => {
  if (process.env.NODE_ENV !== 'production') {
    return <ModeSubscriber position={position} />
  }
  return null
}

const ModeSubscriber = ({ position }: { position: keyof typeof Position }) => {
  const [isHover, setIsHover] = useState(false)
  const devMode = useDevModeObserve()
  if (devMode == null) {
    return null
  }
  return (
    <div
      onClick={devMode.is ? devMode.off : devMode.on}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        position: 'fixed',
        border: '1px solid #ffffff60',
        padding: '8px 16px',
        borderRadius: 8,
        fontSize: 8,
        cursor: 'pointer',
        color: 'white',
        fontWeight: 900,
        transition: 'all 200ms',
        ...Position[position],
        backgroundColor: devMode.is ? '#00ff4c' : '#ffffff10',
        textShadow: `0px 0px 8px ${devMode.is ? '#005018' : '#000'}`,
        transform: isHover ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      Suspensive.DevMode: {devMode.is ? 'on' : 'off'}
    </div>
  )
}
