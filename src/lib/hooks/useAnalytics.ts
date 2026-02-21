import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useAnalytics() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_financial_summary')
        .select('*')
        .order('month', { ascending: false })
        .limit(6)
      
      if (error) throw error
      return data
    }
  })
}
