'use client'

import React from 'react'

export const ReloadButton = () => {
  return (
    <button onClick={() => window.location.reload()} type="button">
      reload
    </button>
  )
}
