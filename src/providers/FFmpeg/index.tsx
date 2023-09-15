import React, { createContext, useContext, useRef, useState } from 'react'
import { useAsync } from 'react-use'

import { FFmpeg } from '@ffmpeg/ffmpeg'

import { loadFFmpeg } from '~/libs/ffmpeg'

interface FFmpegContextProps {
  ffmpeg: FFmpeg
  loaded: boolean
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>
}

interface FFmpegProviderProps {
  children: React.ReactNode
}

export const FFmpegContext = createContext<FFmpegContextProps | undefined>(
  undefined
)

export const FFmpegProvider: React.FC<FFmpegProviderProps> = rest => {
  const [loaded, setLoaded] = useState(false)

  const ffmpegRef = useRef(new FFmpeg())

  useAsync(async () => {
    await loadFFmpeg(ffmpegRef.current)

    setLoaded(ffmpegRef.current.loaded)

    return ffmpegRef.current
  }, [])

  return (
    <FFmpegContext.Provider
      value={{ ffmpeg: ffmpegRef.current, loaded, setLoaded }}
      {...rest}
    />
  )
}

export const useFFmpeg = () => {
  const context = useContext(FFmpegContext)

  if (context === undefined) {
    throw new Error('useFFmpeg must be used within a FFmpegProvider.')
  }

  return context
}
