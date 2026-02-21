import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { MaintenanceLog } from '@/lib/types/database'

export function useMaintenance() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_logs')
        .select('*')
        .order('service_date', { ascending: false })
      
      if (error) throw error
      return data as MaintenanceLog[]
    }
  })
}
