import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { FleetKpiSummary } from '@/lib/types/database'

export function useFleetKPI() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['fleet_kpi_summary'],
    queryFn: async () => {
      // Compute all KPIs directly from source-of-truth tables so they are
      // never stale due to vehicles.status getting out of sync.
      const [
        { count: dispatchedCount },
        { count: openMaintenanceCount },
        { count: totalActiveVehicles },
      ] = await Promise.all([
        // Active Fleet = trips currently dispatched
        supabase
          .from('trips')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'On Way'),
        // Maintenance Alerts = open (incomplete) maintenance logs
        supabase
          .from('maintenance_logs')
          .select('id', { count: 'exact', head: true })
          .eq('is_completed', false),
        // Total active = non-retired vehicles
        supabase
          .from('vehicles')
          .select('id', { count: 'exact', head: true })
          .neq('status', 'Retired'),
      ])

      const active = dispatchedCount ?? 0
      const total = totalActiveVehicles ?? 0
      const utilization = total > 0 ? (active / total) * 100 : 0

      return {
        on_trip_count: active,
        in_shop_count: openMaintenanceCount ?? 0,
        available_count: total - active,
        total_active_vehicles: total,
        utilization_rate: utilization,
      } satisfies FleetKpiSummary
    },
  })
}
