import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { ExpenseLog } from '@/lib/types/database'

export function useExpenses() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fuel_logs')
        .select('*')
        .order('date', { ascending: false })
      
      if (error) throw error
      return data as ExpenseLog[]
    }
  })
}
