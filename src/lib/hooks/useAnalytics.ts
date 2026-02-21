import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type {
  FleetKpiSummary,
  MonthlyFinancialSummaryRow,
  VehicleCostSummary,
  Vehicle,
} from '@/lib/types/database'

export interface RawFuelLog {
  id: string
  fuel_date: string
  liters: number
  total_cost: number
  trip_id: string | null
  trips: {
    distance_km: number | null
    vehicles: { id: string; name: string } | null
  } | null
}

export function useAnalytics() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()

      const [
        { data: monthly, error: monthlyError },
        { data: costSummary, error: costError },
        { data: fuelLogs, error: fuelLogsError },
        { data: availableVehicles, error: availableVehiclesError },
        { data: recentTrips, error: recentTripsError },
        { count: dispatchedCount },
        { count: openMaintenanceCount },
        { count: totalActiveVehicles },
      ] = await Promise.all([
        supabase
          .from('monthly_financial_summary')
          .select('*')
          .order('month_label', { ascending: false })
          .limit(12),
        supabase
          .from('vehicle_cost_summary')
          .select('*'),
        // Direct query — no broken view, compute km/L in JS
        supabase
          .from('fuel_logs')
          .select('id, fuel_date, liters, total_cost, trip_id, trips!inner(distance_km, vehicles!inner(id, name))')
          .not('trip_id', 'is', null)
          .order('fuel_date', { ascending: true })
          .limit(500),
        supabase
          .from('vehicles')
          .select('id,name,status')
          .eq('status', 'Available'),
        supabase
          .from('trips')
          .select('vehicle_id')
          .gt('created_at', thirtyDaysAgo),
        // KPI: compute directly from source tables (never stale)
        supabase
          .from('trips')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'On Way'),
        supabase
          .from('maintenance_logs')
          .select('id', { count: 'exact', head: true })
          .eq('is_completed', false),
        supabase
          .from('vehicles')
          .select('id', { count: 'exact', head: true })
          .neq('status', 'Retired'),
      ])

      if (monthlyError) throw monthlyError
      if (costError) throw costError
      if (fuelLogsError) throw fuelLogsError
      if (availableVehiclesError) throw availableVehiclesError
      if (recentTripsError) throw recentTripsError

      const active = dispatchedCount ?? 0
      const total = totalActiveVehicles ?? 0
      const fleetKpi: FleetKpiSummary = {
        on_trip_count: active,
        in_shop_count: openMaintenanceCount ?? 0,
        available_count: total - active,
        total_active_vehicles: total,
        utilization_rate: total > 0 ? (active / total) * 100 : 0,
      }

      const activeVehicleIds = new Set((recentTrips ?? []).map((trip) => trip.vehicle_id))
      const deadStock = (availableVehicles ?? []).filter((vehicle) => !activeVehicleIds.has(vehicle.id))

      return {
        monthly: (monthly ?? []) as MonthlyFinancialSummaryRow[],
        costSummary: (costSummary ?? []) as VehicleCostSummary[],
        fuelLogs: (fuelLogs ?? []) as unknown as RawFuelLog[],
        fleetKpi,
        deadStock: deadStock as Pick<Vehicle, 'id' | 'name' | 'status'>[],
      }
    }
  })
}
