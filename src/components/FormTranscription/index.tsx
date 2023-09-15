'use client'

import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { fetchFile } from '@ffmpeg/util'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileVideo, Upload } from 'lucide-react'
import mime from 'mime'
import { NFTStorage } from 'nft.storage'
import { z } from 'zod'

import { transcriptionSchema, videoSchema } from '~/libs/zod'

import { api } from '~/services/api'
import { storage } from '~/services/storage'

import { useFFmpeg } from '~/providers/FFmpeg'

import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Separator } from '~/components/ui/separator'
import { Textarea } from '~/components/ui/textarea'

const statusSchema = z.enum([
  'waiting',
  'converting',
  'uploading',
  'generating',
  'success'
])

type Status = z.infer<typeof statusSchema>

const ACCEPTED_VIDEO_TYPES = ['video/mp4']

const uploadVideoSchema = z.object({
  video: z.custom<FileList>(),
  prompt: z.string().optional()
})

const statusMessages = {
  converting: 'Convertendo...',
  generating: 'Transcrevendo...',
  uploading: 'Carregando...',
  success: 'Sucesso!'
}

export type UploadVideoData = z.infer<typeof uploadVideoSchema>

interface FormTranscriptionProps {
  onVideoUploaded: (cid: string) => void
}

export const FormTranscription: React.FC<FormTranscriptionProps> = ({
  onVideoUploaded
}) => {
  const [status, setStatus] = useState<Status>('waiting')

  const uploadVideoForm = useForm<UploadVideoData>({
    resolver: zodResolver(uploadVideoSchema)
  })

  const { ffmpeg } = useFFmpeg()

  const convertVideoToAudio = async (video: File) => {
    console.log('Convert started.')

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    ffmpeg.on('progress', file => {
      console.log(`Convert progress: ${Math.round(file.progress * 100)}`)
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3'
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })

    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg'
    })

    console.log('Convert finished.')

    return audioFile
  }

  const handleUploadVideo = async (data: UploadVideoData) => {
    const { video, prompt } = data

    const videoFile = video[0]

    if (!videoFile) {
      return
    }

    setStatus('converting')

    const audioFile = await convertVideoToAudio(videoFile)

    setStatus('uploading')

    const files = [
      audioFile,
      new File([JSON.stringify({})], 'transcription.json')
    ]

    const cid = await storage.storeDirectory(files)

    setStatus('generating')

    const { data: transcription } = await api.post<string>(
      `/api/videos/${cid.toString()}/transcription`,
      {
        prompt
      }
    )

    setStatus('success')

    onVideoUploaded(transcription)
  }

  const { handleSubmit, register, watch } = uploadVideoForm

  const videoFile = watch('video')

  const previewURL = useMemo(() => {
    if (!videoFile) {
      return null
    }

    const file = videoFile[0]

    if (!file) {
      return null
    }

    setStatus('waiting')

    return URL.createObjectURL(file)
  }, [videoFile])

  return (
    <FormProvider {...uploadVideoForm}>
      <form onSubmit={handleSubmit(handleUploadVideo)} className="space-y-6">
        <label
          htmlFor="video"
          className="relative flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-primary/5"
        >
          {previewURL ? (
            <video
              src={previewURL}
              controls={false}
              className="pointer-events-none absolute inset-0"
            />
          ) : (
            <>
              <FileVideo className="h-4 w-4" />
              Selecione um vídeo
            </>
          )}
        </label>

        <input
          type="file"
          id="video"
          accept="video/mp4"
          className="sr-only"
          {...register('video')}
        />

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="prompt">Prompt de transcrição</Label>
          <Textarea
            id="prompt"
            placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgulas (,)"
            className="h-20 resize-none leading-relaxed"
            disabled={status !== 'waiting'}
            {...register('prompt')}
          />
        </div>

        <Button
          data-success={status === 'success'}
          type="submit"
          className="w-full data-[success=true]:bg-primary"
          disabled={status !== 'waiting'}
        >
          {status === 'waiting' ? (
            <>
              Carregar vídeo
              <Upload className="ml-2 h-4 w-4" />
            </>
          ) : (
            statusMessages[status]
          )}
        </Button>
      </form>
    </FormProvider>
  )
}
