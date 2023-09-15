'use client'

import React from 'react'

import { ThemeProvider } from 'next-themes'

import { FFmpegProvider } from '../../providers/FFmpeg'

interface ProvidersProps {
  children: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <FFmpegProvider>
          <>{children}</>
        </FFmpegProvider>
      </ThemeProvider>
    </>
  )
}
