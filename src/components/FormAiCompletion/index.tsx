'use client'

import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useAsync } from 'react-use'

import { zodResolver } from '@hookform/resolvers/zod'
import { Wand2 } from 'lucide-react'
import { z } from 'zod'

import { Prompts } from '~/libs/zod'

import { api } from '~/services/api'

import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'

import { Slider } from '../ui/slider'

const completionSchema = z.object({
  prompt: z.string(),
  model: z.string().default('gpt3.5'),
  temperature: z.number().default(0.5)
})

export type CompletionData = z.infer<typeof completionSchema>

interface FormAiCompletionProps {
  temperature: number
  onTemperature: (temperature: number) => void
  onPromptSelected: (template: string) => void
  handleSubmitCompletion: (event: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export const FormAiCompletion: React.FC<FormAiCompletionProps> = ({
  temperature,
  onTemperature,
  onPromptSelected,
  handleSubmitCompletion,
  isLoading
}) => {
  const completionForm = useForm<CompletionData>({
    resolver: zodResolver(completionSchema),
    defaultValues: {
      model: 'gpt3.5',
      temperature: 0.5
    }
  })

  const handleCompletion = async (data: CompletionData) => {
    onTemperature(data.temperature)
  }

  const { handleSubmit, setValue, getValues, watch } = completionForm

  const { value: prompts } = useAsync(async () => {
    const { data } = await api.get<Prompts[]>('/api/prompts')

    return data
  }, [])

  return (
    <FormProvider {...completionForm}>
      <form onSubmit={handleSubmitCompletion} className="space-y-6">
        <div className="space-y-2">
          <Label>Prompt</Label>

          <Select onValueChange={onPromptSelected}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um prompt..." />
            </SelectTrigger>

            <SelectContent>
              {prompts?.map(prompt => (
                <SelectItem key={prompt.id} value={prompt.template}>
                  {prompt.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Modelo</Label>

          <Select
            disabled
            defaultValue={getValues('model')}
            onValueChange={value => setValue('model', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
            </SelectContent>
          </Select>

          <span className="block text-xs italic text-muted-foreground">
            você poderá customizar essa opção em breve
          </span>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label>Temperatura</Label>

          <Slider
            min={0}
            max={1}
            step={0.1}
            value={[temperature]}
            onValueChange={value => onTemperature(value[0])}
          />

          <span className="block text-xs italic text-muted-foreground">
            Valores mais altos tendem a deixar o resultado mais criativo e com
            possíveis erros
          </span>
        </div>

        <Separator />

        <Button type="submit" className="w-full" disabled={isLoading}>
          Executar
          <Wand2 className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </FormProvider>
  )
}
