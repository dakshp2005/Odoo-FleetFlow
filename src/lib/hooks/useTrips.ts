import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Trip } from '@/lib/types/database'

export function useTrips() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Trip[]
    }
  })
}
