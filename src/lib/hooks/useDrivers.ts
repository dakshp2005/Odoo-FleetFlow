import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { DriverPerformanceSummary } from '@/lib/types/database'

export function useDrivers() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['drivers', 'driver_performance_summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_performance_summary')
        .select('*')
        .order('full_name', { ascending: true })
      
      if (error) throw error
      return data as DriverPerformanceSummary[]
    }
  })
}
