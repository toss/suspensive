import * as AccessibleIcon from '@radix-ui/react-accessible-icon'
import clsx from 'clsx'
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type CalloutType =
  | 'default'
  | 'info'
  | 'warning'
  | 'error'
  | 'deprecated'
  | 'experimental'

type CalloutProps = Omit<ComponentPropsWithoutRef<'div'>, 'type'> & {
  type?: CalloutType
  children: ReactNode
}

const calloutConfig = {
  default: {
    icon: Info,
    label: 'Info',
    className: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30',
  },
  info: {
    icon: Info,
    label: 'Info',
    className: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Warning',
    className: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30',
  },
  error: {
    icon: AlertCircle,
    label: 'Error',
    className: 'border-red-500 bg-red-50 dark:bg-red-950/30',
  },
  deprecated: {
    icon: AlertCircle,
    label: 'Deprecated',
    className: 'border-red-500 bg-red-50 dark:bg-red-950/30',
  },
  experimental: {
    icon: AlertTriangle,
    label: 'Experimental',
    className: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30',
  },
}

export const Callout = ({
  type = 'default',
  children,
  className,
  ...props
}: CalloutProps) => {
  const config = calloutConfig[type]
  const Icon = config.icon

  return (
    <div
      role="note"
      aria-label={config.label}
      className={clsx(
        'my-6 flex gap-3 rounded-lg border-l-4 p-4',
        config.className,
        className
      )}
      {...props}
    >
      <AccessibleIcon.Root label={config.label}>
        <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
      </AccessibleIcon.Root>
      <div className="flex-1">{children}</div>
    </div>
  )
}
