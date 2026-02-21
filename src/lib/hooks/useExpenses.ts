import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { ExpenseLog } from '@/lib/types/database'

export type ExpenseRow = ExpenseLog & {
  vehicles: { name: string; license_plate: string } | null
  trips: {
    id: string
    origin: string
    destination: string
    distance_km: number | null
    status: string
    drivers: { full_name: string } | null
  } | null
}

export function useExpenses() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fuel_logs')
        .select('*, vehicles(name,license_plate), trips(id,origin,destination,distance_km,status,drivers(full_name))')
        .order('fuel_date', { ascending: false })

      if (error) throw error
      return data as ExpenseRow[]
    }
  })
}
