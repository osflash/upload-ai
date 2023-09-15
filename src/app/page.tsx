'use client'

import React, { useState } from 'react'

import { useCompletion } from 'ai/react'

import { FFmpeg } from '~/components/FFmpeg'
import { FormAiCompletion } from '~/components/FormAiCompletion'
import { FormTranscription } from '~/components/FormTranscription'
import { Separator } from '~/components/ui/separator'
import { Textarea } from '~/components/ui/textarea'

const HomePage: React.FC = () => {
  const [videoCID, setVideoCID] = useState<string | null>(null)
  const [temperature, setTemperature] = useState(0.5)

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading
  } = useCompletion({
    api: '/api/ai/complete',
    body: {
      cid: videoCID,
      temperature
    }
  })

  return (
    <main className="flex flex-1 gap-6 p-6">
      <div className="flex flex-1 flex-col gap-4">
        <div className="grid flex-1 grid-rows-2 gap-4">
          <Textarea
            className="resize-none p-4 leading-relaxed"
            placeholder="Inclua o prompt para IA..."
            value={input}
            onChange={handleInputChange}
          />
          <Textarea
            className="resize-none p-4 leading-relaxed"
            placeholder="Resultado gerado pela IA..."
            readOnly
            value={completion}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Lembre-se: você pode utilizar a variável{' '}
          <code className="text-violet-400">{'{transcription}'}</code> no seu
          prompt para adicionar o conteúdo do vídeo selecionado.
        </p>
      </div>

      <aside className="w-80 space-y-6">
        <FFmpeg />

        <FormTranscription onVideoUploaded={setVideoCID} />

        <Separator />

        <FormAiCompletion
          onTemperature={setTemperature}
          onPromptSelected={setInput}
          handleSubmitCompletion={handleSubmit}
          temperature={temperature}
          isLoading={isLoading}
        />
      </aside>
    </main>
  )
}

export default HomePage
