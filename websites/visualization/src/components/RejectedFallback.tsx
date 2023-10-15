'use client'

import type { ErrorBoundaryFallbackProps } from '@suspensive/react'
import { Box, Button, Description } from './uis'

export const RejectedFallback = (props: ErrorBoundaryFallbackProps) => (
  <Box.Error>
    <Description.Error>Error: {props.error.message}</Description.Error>
    <Button onClick={props.reset}>↻</Button>
  </Box.Error>
)
