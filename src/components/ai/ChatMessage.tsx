import { Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { UIMessage } from 'ai'

export function ChatMessage({ message }: Readonly<{ message: UIMessage }>) {
  const isAI = message.role === 'assistant'

  // Extract text from parts (new AI SDK v4 shape)
  const text = message.parts
    .filter((p): p is Extract<typeof p, { type: 'text' }> => p.type === 'text')
    .map((p) => p.text)
    .join('')

  if (!text) return null

  return (
    <div className={cn('flex gap-2 text-sm', isAI ? 'flex-row' : 'flex-row-reverse')}>
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
        isAI ? 'bg-brand text-white' : 'bg-surface-2 text-muted-foreground'
      )}>
        {isAI ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
      </div>
      <div className={cn(
        'rounded-xl px-3 py-2 max-w-[85%] leading-relaxed whitespace-pre-wrap',
        isAI
          ? 'bg-surface-2 text-foreground'
          : 'bg-brand text-white'
      )}>
        {text}
      </div>
    </div>
  )
}
