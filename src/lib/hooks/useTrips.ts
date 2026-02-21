import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { TripWithRelations } from '@/lib/types/database'

export function useTrips() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*, vehicles(id,name,license_plate,type,max_capacity_kg), drivers(id,full_name,status,license_expiry,license_category,safety_score)')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as TripWithRelations[]
    }
  })
}
