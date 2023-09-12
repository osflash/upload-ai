import React from 'react'

import { Form } from '~/components/Form'
import { FormTranscription } from '~/components/FormTranscription'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Separator } from '~/components/ui/separator'
import { Textarea } from '~/components/ui/textarea'

const HomePage: React.FC = () => {
  return (
    <main className="flex flex-1 gap-6 p-6">
      <div className="flex flex-1 flex-col gap-4">
        <div className="grid flex-1 grid-rows-2 gap-4">
          <Textarea
            className="resize-none p-4 leading-relaxed"
            placeholder="Inclua o prompt para IA..."
          />
          <Textarea
            className="resize-none p-4 leading-relaxed"
            placeholder="Resultado gerado pela IA..."
            readOnly
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Lembre-se: você pode utilizar a variável{' '}
          <code className="text-violet-400">{'{transcription}'}</code> no seu
          prompt para adicionar o conteúdo do vídeo selecionado.
        </p>
      </div>

      <aside className="w-80 space-y-6">
        <FormTranscription />

        <Separator />

        <Form />
      </aside>
    </main>
  )
}

export default HomePage
