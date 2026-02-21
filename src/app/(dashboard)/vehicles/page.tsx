"use client";

import { useEffect, useMemo, useState } from "react";
import { VehicleTable } from "@/components/vehicles/VehicleTable";
import { VehicleFormDialog } from "@/components/vehicles/VehicleFormDialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { useVehicles } from "@/lib/hooks/useVehicles";
import type { Vehicle } from "@/lib/types/database";
import { useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VehiclesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const { data = [], isLoading, refetch } = useVehicles()
  const queryClient = useQueryClient()

  useEffect(() => {
    const params = new URLSearchParams(globalThis.window?.location.search)
    if (params.get('modal') === 'open') {
      setDialogOpen(true)
    }
  }, [])

  const refreshAll = () => {
    void queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    void queryClient.invalidateQueries({ queryKey: ['fleet_kpi_summary'] })
    void queryClient.invalidateQueries({ queryKey: ['vehicle_cost_summary'] })
    void refetch()
  }

  const handleOpenCreate = () => {
    setEditingVehicle(null)
    setDialogOpen(true)
  }

  const filteredVehicles = useMemo(() => {
    const term = search.trim().toLowerCase()
    return data.filter((v) => {
      const matchesSearch =
        !term ||
        v.name.toLowerCase().includes(term) ||
        (v.model ?? "").toLowerCase().includes(term) ||
        v.license_plate.toLowerCase().includes(term) ||
        (v.region ?? "").toLowerCase().includes(term)
      const matchesType = typeFilter === "All" || v.type === typeFilter
      const matchesStatus = statusFilter === "All" || v.status === statusFilter
      return matchesSearch && matchesType && matchesStatus
    })
  }, [data, search, typeFilter, statusFilter])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Registry"
        subtitle="Manage your fleet assets, status and registration"
        actionLabel="+ Add Vehicle"
        onAction={handleOpenCreate}
      />

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <div className="relative sm:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, plate, region…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Truck">Truck</SelectItem>
            <SelectItem value="Van">Van</SelectItem>
            <SelectItem value="Bike">Bike</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="On Trip">On Trip</SelectItem>
            <SelectItem value="In Shop">In Shop</SelectItem>
            <SelectItem value="Retired">Retired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <VehicleTable
        vehicles={filteredVehicles}
        isLoading={isLoading}
        onEdit={(vehicle) => { setEditingVehicle(vehicle); setDialogOpen(true) }}
        onRefresh={refreshAll}
      />
      <VehicleFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingVehicle={editingVehicle}
        onSuccess={refreshAll}
      />
    </div>
  );
}
