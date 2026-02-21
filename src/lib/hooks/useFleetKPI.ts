import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useFleetKPI() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['fleet-kpi'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fleet_kpi_summary')
        .select('*')
        .single()
      
      if (error) throw error
      return data
    }
  })
}
