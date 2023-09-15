import { NextRequest, NextResponse } from 'next/server'

import { z } from 'zod'

import { cidSchema, videoSchema } from '~/libs/zod'

import { openai } from '~/services/openai'
import { getAudio, storage } from '~/services/storage'

interface Params {
  params: {
    cid: string
  }
}

export const POST = async (request: NextRequest, { params }: Params) => {
  const paramsSchema = z.object({
    cid: cidSchema
  })

  const { cid } = paramsSchema.parse(params)

  const bodySchema = z.object({
    prompt: z.string()
  })

  const { prompt } = bodySchema.parse(await request.json())

  const file = await getAudio(cid)

  const transcription = 'texto gerado pela IA'

  // const { text: transcription } = await openai.audio.transcriptions.create({
  //   file,
  //   model: 'whisper-1',
  //   language: 'pt',
  //   response_format: 'json',
  //   temperature: 0,
  //   prompt
  // })

  const audioFile = new File([await file.blob()], 'audio.mp3', {
    type: 'audio/mpeg'
  })

  const files = [
    audioFile,
    new File([JSON.stringify({ transcription })], 'transcription.json')
  ]

  const response = await storage.storeDirectory(files)

  return NextResponse.json(response)
}
