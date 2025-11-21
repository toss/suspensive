import type { ReactNode } from 'react'

type CalloutType = 'info' | 'warning' | 'error' | 'deprecated' | 'experimental'

type CalloutProps = {
  type?: CalloutType
  children: ReactNode
  emoji?: string
}

const typeConfig: Record<
  CalloutType,
  { icon: string; className: string; bgClassName: string }
> = {
  info: {
    icon: 'ℹ️',
    className: 'border-blue-200 dark:border-blue-800',
    bgClassName: 'bg-blue-50 dark:bg-blue-950',
  },
  warning: {
    icon: '⚠️',
    className: 'border-yellow-200 dark:border-yellow-800',
    bgClassName: 'bg-yellow-50 dark:bg-yellow-950',
  },
  error: {
    icon: '🚫',
    className: 'border-red-200 dark:border-red-800',
    bgClassName: 'bg-red-50 dark:bg-red-950',
  },
  deprecated: {
    icon: '🚫',
    className: 'border-red-200 dark:border-red-800',
    bgClassName: 'bg-red-50 dark:bg-red-950',
  },
  experimental: {
    icon: '⚠️',
    className: 'border-yellow-200 dark:border-yellow-800',
    bgClassName: 'bg-yellow-50 dark:bg-yellow-950',
  },
}

export const Callout = ({ type = 'info', children, emoji }: CalloutProps) => {
  const config = typeConfig[type]

  return (
    <div
      className={`my-6 flex gap-3 rounded-lg border p-4 ${config.className} ${config.bgClassName}`}
    >
      <span className="text-xl leading-6">{emoji || config.icon}</span>
      <div className="flex-1 text-sm leading-6 text-gray-900 dark:text-gray-100">
        {children}
      </div>
    </div>
  )
}
