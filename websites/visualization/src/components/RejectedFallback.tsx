'use client'

import { ErrorBoundaryFallbackProps } from '@suspensive/react'
import { Box, Button, Description } from './uis'

export const RejectedFallback = ({ error, reset }: ErrorBoundaryFallbackProps) => (
  <Box.Error>
    <Description.Error>Error: {JSON.stringify(error.message)}</Description.Error>
    <Button onClick={reset}>↻</Button>
  </Box.Error>
)
