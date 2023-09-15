import { CID } from 'multiformats'
import { z } from 'zod'

export const cidSchema = z
  .string()
  .refine(CID.parse, { message: 'CID invalid' })

export const videoSchema = z.object({
  name: z.string(),
  transcription: z.string().nullable().default(null),
  createdAt: z.number().default(Date.now())
})

export const transcriptionSchema = z.object({
  transcription: z.string()
})

export const promptSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  template: z.string()
})

export type Prompts = z.infer<typeof promptSchema>
