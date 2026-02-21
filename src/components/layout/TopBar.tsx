'use client'

import { useState } from 'react'
import { Sparkles, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AIChatPanel } from '@/components/ai/AIChatPanel'

export function TopBar() {
  const [aiOpen, setAiOpen] = useState(false)

  return (
    <>
      <header className="h-14 border-b bg-background flex items-center justify-between px-6">
        <div /> {/* Breadcrumb slot — add per page */}
        <div className="flex items-center gap-2">
          {/* AI Button — the crown jewel */}
          <Button
            onClick={() => setAiOpen(true)}
            size="sm"
            className="gap-1.5 bg-brand hover:bg-brand-dark text-white"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ask AI
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="w-4 h-4" />
          </Button>
          <Avatar className="w-8 h-8 cursor-pointer">
            <AvatarFallback className="text-xs bg-surface-2">FM</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <AIChatPanel open={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  )
}
