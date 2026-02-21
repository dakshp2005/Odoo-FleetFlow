'use client'

import { useChat } from 'ai/react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Bot, Send, Sparkles } from 'lucide-react'
import { ChatMessage } from './ChatMessage'

interface AIChatPanelProps {
  open: boolean
  onClose: () => void
}

export function AIChatPanel({ open, onClose }: AIChatPanelProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
  })

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[420px] flex flex-col p-0" side="right">
        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle className="flex items-center gap-2 text-sm font-semibold">
            <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            FleetFlow AI
          </SheetTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Ask anything about your fleet, drivers, or finances
          </p>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-3">
          {messages.length === 0 && (
            <div className="space-y-2 mt-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Try asking...
              </p>
              {[
                'Which vehicles are available right now?',
                'Who has the lowest safety score?',
                'Show me this month\'s net profit',
                'Add a new driver named Ravi Kumar',
                'Which vehicle costs the most to run?',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleInputChange({ target: { value: suggestion } } as any)}
                  className="w-full text-left text-xs px-3 py-2 rounded-lg border border-border hover:bg-surface-2 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          <div className="space-y-3">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex gap-2 items-center text-muted-foreground text-xs">
                <Bot className="w-4 h-4 animate-pulse" />
                Thinking...
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t px-4 py-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about your fleet..."
              className="resize-none text-sm min-h-[40px] max-h-[120px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e as any)
                }
              }}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
