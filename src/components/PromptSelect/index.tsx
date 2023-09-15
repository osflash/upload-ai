'use client'

import React from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { useAsync } from 'react-use'

import { Prompts } from '~/libs/zod'

import { api } from '~/services/api'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select'

export const PromptSelect = React.forwardRef<
  HTMLButtonElement,
  UseFormRegisterReturn
>(({ name, onChange, ...rest }, ref) => {
  const { value: prompts } = useAsync(async () => {
    const { data } = await api.get<Prompts[]>('/api/prompts')

    return data
  }, [])

  return (
    <Select
      onValueChange={value => onChange({ target: { name, value } })}
      {...rest}
    >
      <SelectTrigger ref={ref}>
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
  )
})

PromptSelect.displayName = Select.displayName
