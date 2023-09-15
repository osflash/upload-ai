'use client'

import React, { useState } from 'react'

import { FFmpeg } from '~/components/FFmpeg'
import { FormAiCompletion } from '~/components/FormAiCompletion'
import { FormTranscription } from '~/components/FormTranscription'
import { Separator } from '~/components/ui/separator'

export const SideBar: React.FC = () => {
  const [videoCID, setVideoCID] = useState<string | null>(null)

  return (
    <aside className="w-80 space-y-6">
      <FFmpeg />

      <FormTranscription onVideoUploaded={setVideoCID} />

      <Separator />

      <FormAiCompletion />
    </aside>
  )
}
