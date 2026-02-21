import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Driver } from '@/lib/types/database'

export function useDrivers() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Driver[]
    }
  })
}
