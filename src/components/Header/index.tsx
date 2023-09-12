import React from 'react'

import { Github } from 'lucide-react'

import { ToggleTheme } from '~/components/ToggleTheme'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <h1 className="text-xl font-bold">upload.ai</h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Desenvolvido com ❤️ no NLW da Rocketseat
        </span>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="outline">
          <Github className="mr-2 h-4 w-4" />
          Github
        </Button>
        <ToggleTheme />
      </div>
    </header>
  )
}
