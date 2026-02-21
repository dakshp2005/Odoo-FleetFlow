# 🚀 FleetFlow — Scaffold V2
## Next.js + shadcn/ui (Vega) + Supabase + AI Assistant

---

## WHAT CHANGED FROM V1
- shadcn/ui Vega preset replaces raw Radix + manual design tokens
- Font stays Inter (shadcn default, works well for ops dashboards)
- AI Assistant chat panel added as a new feature layer
- Folder structure updated with `/ai` route + `AIChatPanel` component
- All Radix installs removed (shadcn handles them internally)

---

## STEP 1 — Create Next.js Project

```bash
npx create-next-app@latest fleetflow \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd fleetflow
```

---

## STEP 2 — Initialize shadcn/ui with Vega Preset

```bash
npx shadcn@latest create \
  --preset "https://ui.shadcn.com/init?base=radix&style=vega&baseColor=zinc&theme=zinc&iconLibrary=hugeicons&font=inter&menuAccent=subtle&menuColor=default&radius=medium&template=next&rtl=false" \
  --template next
```

This installs:
- ✅ Vega style system (zinc base)
- ✅ Hugeicons icon library
- ✅ Inter font
- ✅ Medium radius tokens
- ✅ Subtle menu accent

---

## STEP 3 — Add shadcn Components We Need

Run these one by one (or together):

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add dialog
npx shadcn@latest add sheet
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add card
npx shadcn@latest add tabs
npx shadcn@latest add avatar
npx shadcn@latest add switch
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tooltip
npx shadcn@latest add separator
npx shadcn@latest add skeleton
npx shadcn@latest add toast
npx shadcn@latest add form
npx shadcn@latest add textarea
npx shadcn@latest add scroll-area
npx shadcn@latest add sidebar
```

> 💡 `sidebar` is the shadcn sidebar primitive — use this as the base for our nav layout.

---

## STEP 4 — Install Additional Dependencies

```bash
npm install \
  @supabase/supabase-js \
  @supabase/ssr \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  recharts \
  react-hook-form \
  @hookform/resolvers \
  zod \
  sonner \
  date-fns \
  clsx \
  tailwind-merge \
  ai \
  @ai-sdk/google
```

> `ai` = Vercel AI SDK (handles streaming chat)
> `@ai-sdk/google` = Claude backend adapter

---

## STEP 5 — Environment Variables

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic (for AI Assistant)
ANTHROPIC_API_KEY=your_anthropic_api_key
```

> `SUPABASE_SERVICE_ROLE_KEY` is used only server-side in the AI route
> so the AI can read/write data on behalf of the user securely.
> Get it from: Supabase → Settings → API → service_role key

---

## STEP 6 — Full Folder Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx                  ← Login page
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                    ← Shell: Sidebar + TopBar + AI Panel
│   │   ├── dashboard/
│   │   │   └── page.tsx                  ← Command Center
│   │   ├── vehicles/
│   │   │   └── page.tsx                  ← Vehicle Registry
│   │   ├── trips/
│   │   │   └── page.tsx                  ← Trip Dispatcher
│   │   ├── maintenance/
│   │   │   └── page.tsx                  ← Maintenance Logs
│   │   ├── expenses/
│   │   │   └── page.tsx                  ← Expense & Fuel Logging
│   │   ├── drivers/
│   │   │   └── page.tsx                  ← Driver Performance
│   │   └── analytics/
│   │       └── page.tsx                  ← Analytics & Reports
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts              ← Supabase auth callback
│   │   └── ai/
│   │       └── chat/
│   │           └── route.ts              ← AI Assistant API (Claude)
│   │
│   ├── globals.css
│   ├── layout.tsx                        ← Root layout + QueryProvider
│   └── page.tsx                          ← Redirects to /dashboard
│
├── components/
│   ├── ui/                               ← shadcn auto-generated (don't touch)
│   │
│   ├── layout/
│   │   ├── AppSidebar.tsx                ← shadcn Sidebar with nav items
│   │   ├── TopBar.tsx                    ← Header: breadcrumb + user + AI toggle
│   │   └── PageHeader.tsx                ← Per-page title + action button slot
│   │
│   ├── ai/
│   │   ├── AIChatPanel.tsx               ← Slide-in Sheet with chat UI
│   │   ├── ChatMessage.tsx               ← Individual message bubble
│   │   └── ChatInput.tsx                 ← Input bar with send button
│   │
│   ├── dashboard/
│   │   ├── KPIStrip.tsx                  ← 4 KPI cards row
│   │   ├── RecentTripsTable.tsx          ← Last 5 trips
│   │   └── FleetStatusChart.tsx          ← Recharts donut
│   │
│   ├── vehicles/
│   │   ├── VehicleTable.tsx
│   │   └── VehicleFormDialog.tsx         ← shadcn Dialog with form
│   │
│   ├── trips/
│   │   ├── TripTable.tsx
│   │   ├── TripFormDialog.tsx            ← Cargo weight validation here
│   │   └── TripStatusBadge.tsx
│   │
│   ├── maintenance/
│   │   ├── MaintenanceTable.tsx
│   │   └── MaintenanceFormDialog.tsx
│   │
│   ├── expenses/
│   │   ├── ExpenseTable.tsx
│   │   └── ExpenseFormDialog.tsx
│   │
│   ├── drivers/
│   │   ├── DriverTable.tsx
│   │   └── DriverFormDialog.tsx
│   │
│   └── analytics/
│       ├── MonthlyRevenueChart.tsx       ← Bar chart (Recharts)
│       ├── FuelEfficiencyTable.tsx
│       ├── VehicleROITable.tsx
│       └── MonthlyFinancialSummary.tsx   ← The table from mockup
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     ← Browser client
│   │   ├── server.ts                     ← Server client (cookies)
│   │   └── admin.ts                      ← Service role client (AI use only)
│   │
│   ├── hooks/
│   │   ├── useVehicles.ts
│   │   ├── useTrips.ts
│   │   ├── useDrivers.ts
│   │   ├── useMaintenance.ts
│   │   ├── useExpenses.ts
│   │   ├── useAnalytics.ts
│   │   └── useFleetKPI.ts
│   │
│   ├── types/
│   │   └── database.ts                   ← All TS interfaces (same as V1)
│   │
│   ├── utils/
│   │   ├── cn.ts                         ← clsx + twMerge
│   │   ├── formatters.ts                 ← Currency, date, number
│   │   └── validators.ts                 ← Zod schemas for all forms
│   │
│   ├── constants/
│   │   └── index.ts                      ← Nav items, status styles, enums
│   │
│   └── ai/
│       └── system-prompt.ts              ← Claude system prompt for fleet context
│
└── middleware.ts                         ← Route protection
```

---

## STEP 7 — Supabase Clients

### `src/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### `src/lib/supabase/server.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}
```

### `src/lib/supabase/admin.ts` ← NEW (AI use only)
```typescript
import { createClient } from '@supabase/supabase-js'

// Service role — only used in server-side API routes
// NEVER expose this to the browser
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
```

---

## STEP 8 — AI Assistant API Route

### `src/lib/ai/system-prompt.ts`
```typescript
export const FLEET_SYSTEM_PROMPT = `
You are FleetFlow AI, an intelligent assistant built into a fleet and logistics management system.

You have access to the following data via tool calls:
- vehicles: fleet assets with status (Available, On Trip, In Shop, Retired)
- drivers: driver profiles with license expiry, safety scores, complaints
- trips: delivery records with cargo weight, origin, destination, status
- maintenance_logs: service records linked to vehicles
- fuel_logs: fuel and misc expense records per trip
- Analytics views: vehicle ROI, fuel efficiency, monthly financial summary

Your capabilities:
1. QUERY: Answer questions about fleet data (e.g. "which vehicles are available?")
2. CREATE: Add new records (e.g. "add driver Ravi Kumar with license DL-XX-2027")
3. UPDATE: Change statuses (e.g. "mark Trip #123 as completed")
4. ANALYZE: Summarize financial and operational data

Rules:
- Always confirm destructive actions before executing
- Format currency in INR (₹)
- Dates in DD/MM/YYYY format
- Keep responses concise and structured
- If you can't do something, explain what the user should do manually
- Never expose raw SQL or internal IDs in responses unless asked
`
```

### `src/app/api/ai/chat/route.ts`
```typescript
import { google } from '@ai-sdk/google'         // ← was: anthropic
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { FLEET_SYSTEM_PROMPT } from '@/lib/ai/system-prompt'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: google('gemini-2.0-flash'),           // ← was: anthropic('claude-sonnet-4-5')
    system: FLEET_SYSTEM_PROMPT,
    messages,
    tools: {

      queryFleetData: tool({
        description: 'Query fleet data from the database',
        parameters: z.object({
          table: z.enum([
            'vehicles', 'drivers', 'trips',
            'maintenance_logs', 'fuel_logs',
            'vehicle_cost_summary', 'driver_performance_summary',
            'fleet_kpi_summary', 'monthly_financial_summary',
            'vehicle_fuel_efficiency'
          ]),
          filters: z.record(z.string()).optional(),
          limit: z.number().optional().default(10),
        }),
        execute: async ({ table, filters, limit }) => {
          let query = supabaseAdmin.from(table).select('*').limit(limit)
          if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
              query = query.eq(key, value)
            })
          }
          const { data, error } = await query
          if (error) return { error: error.message }
          return { data, count: data?.length }
        },
      }),

      createRecord: tool({
        description: 'Create a new record in the database',
        parameters: z.object({
          table: z.enum(['vehicles', 'drivers', 'trips', 'maintenance_logs', 'fuel_logs']),
          data: z.record(z.any()),
        }),
        execute: async ({ table, data }) => {
          const { data: result, error } = await supabaseAdmin
            .from(table).insert(data).select().single()
          if (error) return { error: error.message }
          return { success: true, record: result }
        },
      }),

      updateRecord: tool({
        description: 'Update an existing record',
        parameters: z.object({
          table: z.enum(['vehicles', 'drivers', 'trips', 'maintenance_logs']),
          id: z.string(),
          data: z.record(z.any()),
        }),
        execute: async ({ table, id, data }) => {
          const { data: result, error } = await supabaseAdmin
            .from(table).update(data).eq('id', id).select().single()
          if (error) return { error: error.message }
          return { success: true, record: result }
        },
      }),

    },
  })

  return result.toDataStreamResponse()
}
```

---

## STEP 9 — AI Chat Panel Component

### `src/components/ai/AIChatPanel.tsx`
```typescript
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
```

### `src/components/ai/ChatMessage.tsx`
```typescript
import { Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { Message } from 'ai'

export function ChatMessage({ message }: { message: Message }) {
  const isAI = message.role === 'assistant'

  return (
    <div className={cn('flex gap-2 text-sm', isAI ? 'flex-row' : 'flex-row-reverse')}>
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
        isAI ? 'bg-brand text-white' : 'bg-surface-2 text-muted-foreground'
      )}>
        {isAI ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
      </div>
      <div className={cn(
        'rounded-xl px-3 py-2 max-w-[85%] leading-relaxed',
        isAI
          ? 'bg-surface-2 text-foreground'
          : 'bg-brand text-white'
      )}>
        {message.content}
      </div>
    </div>
  )
}
```

---

## STEP 10 — TopBar with AI Toggle

### `src/components/layout/TopBar.tsx`
```typescript
'use client'

import { useState } from 'react'
import { Sparkles, Bell, ChevronDown } from 'lucide-react'
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
```

---

## STEP 11 — AppSidebar

### `src/components/layout/AppSidebar.tsx`
```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar, SidebarContent, SidebarHeader,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { NAV_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils/cn'

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      {/* Logo */}
      <SidebarHeader className="px-4 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <span className="text-white font-bold text-sm">FF</span>
          </div>
          <div>
            <p className="font-semibold text-sm leading-none">FleetFlow</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Fleet Management</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent className="px-2 py-3">
        <SidebarMenu>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={item.href} className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer: user info */}
      <SidebarFooter className="border-t px-4 py-3">
        <p className="text-xs text-muted-foreground">Fleet Manager</p>
      </SidebarFooter>
    </Sidebar>
  )
}
```

---

## STEP 12 — Dashboard Layout

### `src/app/(dashboard)/layout.tsx`
```typescript
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { TopBar } from '@/components/layout/TopBar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopBar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

---

## STEP 13 — Status Constants (shadcn Badge variant compatible)

### `src/lib/constants/index.ts`
```typescript
import {
  LayoutDashboard, Truck, Route,
  Wrench, Receipt, Users, BarChart3
} from 'lucide-react'

export const NAV_ITEMS = [
  { label: 'Dashboard',       href: '/dashboard',    icon: LayoutDashboard },
  { label: 'Vehicle Registry',href: '/vehicles',     icon: Truck },
  { label: 'Trip Dispatcher', href: '/trips',        icon: Route },
  { label: 'Maintenance',     href: '/maintenance',  icon: Wrench },
  { label: 'Trip & Expense',  href: '/expenses',     icon: Receipt },
  { label: 'Performance',     href: '/drivers',      icon: Users },
  { label: 'Analytics',       href: '/analytics',    icon: BarChart3 },
]

// Use with shadcn Badge: <Badge className={VEHICLE_STATUS_STYLES[status]}>
export const VEHICLE_STATUS_STYLES: Record<string, string> = {
  'Available': 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
  'On Trip':   'bg-blue-50   text-blue-700   border-blue-200   hover:bg-blue-50',
  'In Shop':   'bg-amber-50  text-amber-700  border-amber-200  hover:bg-amber-50',
  'Retired':   'bg-zinc-100  text-zinc-500   border-zinc-200   hover:bg-zinc-100',
}

export const DRIVER_STATUS_STYLES: Record<string, string> = {
  'On Duty':   'bg-blue-50  text-blue-700  border-blue-200  hover:bg-blue-50',
  'Off Duty':  'bg-zinc-100 text-zinc-500  border-zinc-200  hover:bg-zinc-100',
  'Suspended': 'bg-red-50   text-red-700   border-red-200   hover:bg-red-50',
}

export const TRIP_STATUS_STYLES: Record<string, string> = {
  'Draft':      'bg-zinc-100  text-zinc-600   border-zinc-200   hover:bg-zinc-100',
  'Dispatched': 'bg-blue-50   text-blue-700   border-blue-200   hover:bg-blue-50',
  'Completed':  'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
  'Cancelled':  'bg-red-50    text-red-600    border-red-200    hover:bg-red-50',
}

export const LICENSE_STATUS_STYLES: Record<string, string> = {
  'Valid':         'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
  'Expiring Soon': 'bg-amber-50   text-amber-700   border-amber-200   hover:bg-amber-50',
  'Expired':       'bg-red-50     text-red-700     border-red-200     hover:bg-red-50',
}
```

---

## STEP 14 — Middleware (Route Protection)

### `src/middleware.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/vehicles') ||
    request.nextUrl.pathname.startsWith('/trips') ||
    request.nextUrl.pathname.startsWith('/maintenance') ||
    request.nextUrl.pathname.startsWith('/expenses') ||
    request.nextUrl.pathname.startsWith('/drivers') ||
    request.nextUrl.pathname.startsWith('/analytics')

  if (!user && isDashboardRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
```

---

## STEP 15 — Run It

```bash
npm run dev
```

`http://localhost:3000` → redirects to `/login` → after auth → `/dashboard` ✅

---

## AI Assistant — What It Can Do (Demo Script)

Use these during the hackathon demo for maximum impact:

| Prompt | What happens |
|--------|-------------|
| "How many vehicles are available right now?" | Queries fleet_kpi_summary, returns count |
| "Which driver has the most complaints?" | Queries driver_performance_summary, sorted |
| "Show me this month's net profit" | Queries monthly_financial_summary |
| "Which vehicle has the worst ROI?" | Queries vehicle_cost_summary, sorted by roi_percentage |
| "Add a new driver: Priya Nair, license MH-01-2028-1234, Van category, expiry 2028-05-20" | Creates driver record live |
| "Mark Van-01 as In Shop" | Updates vehicle status |
| "What's the fuel efficiency of Truck-01?" | Queries vehicle_fuel_efficiency by name |

---

## Build Order

| # | Page | Est. Time |
|---|------|-----------|
| 1 | Login page | 20 min |
| 2 | AppSidebar + Layout shell | 20 min |
| 3 | Command Center Dashboard | 45 min |
| 4 | Trip Dispatcher + validation | 45 min |
| 5 | Vehicle Registry | 30 min |
| 6 | Driver Performance | 30 min |
| 7 | Analytics page | 45 min |
| 8 | Maintenance + Expenses | 30 min |
| 9 | AI Chat Panel | 30 min |
| **Total** | | **~5.5 hrs** |

