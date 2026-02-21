"use client";

import { useMemo, useState } from "react";
import { KPIStrip } from "@/components/dashboard/KPIStrip";
import { RecentTripsTable } from "@/components/dashboard/RecentTripsTable";
import { FleetStatusChart } from "@/components/dashboard/FleetStatusChart";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { useFleetKPI } from "@/lib/hooks/useFleetKPI";
import { useTrips } from "@/lib/hooks/useTrips";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DashboardPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("All")
  const [sortBy, setSortBy] = useState("latest")

  const { data: kpi } = useFleetKPI()
  const { data: trips = [] } = useTrips()

  const { data: pendingCargo = 0 } = useQuery({
    queryKey: ['trips', 'pending-count'],
    queryFn: async () => {
      const supabase = createClient()
      const { count, error } = await supabase
        .from('trips')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'Pending')

      if (error) throw error
      return count ?? 0
    },
  })

  const visibleTrips = useMemo(() => {
    let rows = [...trips]
    const term = search.trim().toLowerCase()

    if (term) {
      rows = rows.filter((trip) =>
        String(trip.id).toLowerCase().includes(term) ||
        trip.origin.toLowerCase().includes(term) ||
        trip.destination.toLowerCase().includes(term) ||
        (trip.vehicles?.name ?? "").toLowerCase().includes(term) ||
        (trip.drivers?.full_name ?? "").toLowerCase().includes(term),
      )
    }

    if (statusFilter !== "All") {
      rows = rows.filter((trip) => trip.status === statusFilter)
    }

    if (vehicleTypeFilter !== "All") {
      rows = rows.filter((trip) => trip.vehicles?.type === vehicleTypeFilter)
    }

    if (sortBy === "latest") {
      rows.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
    } else if (sortBy === "trip") {
      rows.sort((a, b) => String(a.id).localeCompare(String(b.id)))
    } else if (sortBy === "status") {
      rows.sort((a, b) => a.status.localeCompare(b.status))
    }

    return rows.slice(0, 10)
  }, [search, sortBy, statusFilter, vehicleTypeFilter, trips])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Center"
        subtitle="Overview of your fleet operations"
      />
      <KPIStrip
        activeFleet={kpi?.on_trip_count ?? 0}
        maintenanceAlerts={kpi?.in_shop_count ?? 0}
        utilizationRate={kpi?.utilization_rate ?? 0}
        pendingCargo={pendingCargo}
      />
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Input
          placeholder="Search trips, vehicles, drivers…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="col-span-2 md:col-span-1"
        />
        <Select value={vehicleTypeFilter} onValueChange={setVehicleTypeFilter}>
          <SelectTrigger><SelectValue placeholder="Vehicle Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Truck">Truck</SelectItem>
            <SelectItem value="Van">Van</SelectItem>
            <SelectItem value="Bike">Bike</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="On Way">On Way</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="status">Group by Status</SelectItem>
            <SelectItem value="trip">Trip #</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTripsTable trips={visibleTrips} />
        </div>
        <FleetStatusChart />
      </div>
    </div>
  );
}
