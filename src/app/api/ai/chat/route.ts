import { google } from '@ai-sdk/google'
import { streamText, tool } from 'ai'
import type { CoreMessage } from 'ai'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { FLEET_SYSTEM_PROMPT } from '@/lib/ai/system-prompt'

export const maxDuration = 30

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json(
      { error: 'Supabase service configuration is missing.' },
      { status: 500 },
    )
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const bodySchema = z.object({
    messages: z
      .array(
        z.object({
          role: z.enum(['user', 'assistant', 'system']),
          content: z.union([
            z.string(),
            z.array(z.object({ type: z.string() }).passthrough()),
          ]),
        }),
      )
      .min(1, 'At least one message is required'),
  })

  let messages: CoreMessage[]
  try {
    const body: unknown = await req.json()
    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 },
      )
    }
    // Runtime-validated; cast to SDK's discriminated union type
    messages = parsed.data.messages as CoreMessage[]
  } catch {
    return Response.json({ error: 'Malformed JSON body' }, { status: 400 })
  }

  try {
  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: FLEET_SYSTEM_PROMPT,
    messages,
    maxSteps: 5,
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
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}
