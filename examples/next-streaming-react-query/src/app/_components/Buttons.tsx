'use client'

import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

export const Buttons = () => {
  const queryClient = useQueryClient()
  return (
    <div className="text-md space-y-1">
      <button
        onClick={() => {
          queryClient.invalidateQueries()
        }}
        type="button"
        className="w-[100%] cursor-pointer rounded-md bg-blue-500 text-white"
      >
        invalidateQueries()
      </button>
      <button
        onClick={() => {
          queryClient.resetQueries()
        }}
        type="button"
        className="w-[100%] cursor-pointer rounded-md bg-blue-500 text-white"
      >
        resetQueries()
      </button>
      <button
        onClick={() => window.location.reload()}
        type="button"
        className="w-[100%] cursor-pointer rounded-md bg-blue-500 text-white"
      >
        🔄
      </button>
    </div>
  )
}
