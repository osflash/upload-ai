import { NextRequest, NextResponse } from 'next/server'

import { OpenAIStream, StreamingTextResponse } from 'ai'
import { z } from 'zod'

import { cidSchema } from '~/libs/zod'

import { openai } from '~/services/openai'
import { getTranscription } from '~/services/storage'

export const runtime = 'edge'

export const POST = async (request: NextRequest) => {
  const bodySchema = z.object({
    cid: cidSchema,
    prompt: z.string(),
    temperature: z.number().min(0).max(1).default(0.5)
  })

  const { cid, prompt, temperature } = bodySchema.parse(await request.json())

  const { transcription } = await getTranscription(cid)

  if (!transcription) {
    return NextResponse.json(
      { error: 'Video transcription was not generated yet' },
      {
        status: 400
      }
    )
  }

  const promptMessage = prompt.replace('{transcription}', transcription)

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k',
    temperature,
    messages: [{ role: 'user', content: promptMessage }],
    stream: true
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}
