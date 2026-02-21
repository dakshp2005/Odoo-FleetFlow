'use client'

import { useEffect, useMemo, useState } from 'react'
import { TripTable } from "@/components/trips/TripTable"
import { TripFormDialog } from "@/components/trips/TripFormDialog"
import { PageHeader } from "@/components/layout/PageHeader"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTrips } from '@/lib/hooks/useTrips'
import { useVehicles } from '@/lib/hooks/useVehicles'
import { createClient } from '@/lib/supabase/client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Driver } from '@/lib/types/database'

export default function TripsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data: trips = [], isLoading, refetch } = useTrips()
  const { data: vehicles = [] } = useVehicles()

  const { data: drivers = [] } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .order('full_name', { ascending: true })

      if (error) throw error
      return data as Driver[]
    },
  })

  useEffect(() => {
    const params = new URLSearchParams(globalThis.window?.location.search)
    if (params.get('modal') === 'open') {
      setDialogOpen(true)
    }
  }, [])

  const filteredTrips = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) {
      return trips
    }

    return trips.filter((trip) =>
      String(trip.id).toLowerCase().includes(term) ||
      trip.origin.toLowerCase().includes(term) ||
      trip.destination.toLowerCase().includes(term) ||
      trip.status.toLowerCase().includes(term),
    )
  }, [search, trips])

  const refreshAll = () => {
    void queryClient.invalidateQueries({ queryKey: ['trips'] })
    void queryClient.invalidateQueries({ queryKey: ['fleet_kpi_summary'] })
    void queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    void queryClient.invalidateQueries({ queryKey: ['drivers'] })
    void refetch()
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Trip Dispatcher" 
        subtitle="Schedule and monitor vehicle trips across regions"
        actionLabel="+ New Trip"
        onAction={() => setDialogOpen(true)}
      />
      
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trips, loads..."
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <TripTable trips={filteredTrips} isLoading={isLoading} onRefresh={refreshAll} />

      <TripFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        vehicles={vehicles}
        drivers={drivers}
        onSuccess={refreshAll}
      />
    </div>
  )
}
