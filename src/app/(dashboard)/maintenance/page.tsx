'use client'

import { useMemo, useState } from 'react'
import { MaintenanceTable } from "@/components/maintenance/MaintenanceTable"
import { MaintenanceFormDialog } from "@/components/maintenance/MaintenanceFormDialog"
import { PageHeader } from "@/components/layout/PageHeader"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useMaintenance } from '@/lib/hooks/useMaintenance'
import { useVehicles } from '@/lib/hooks/useVehicles'
import { useQueryClient } from '@tanstack/react-query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function MaintenancePage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const { data = [], isLoading, refetch } = useMaintenance()
  const { data: vehicles = [] } = useVehicles()
  const queryClient = useQueryClient()

  const refreshAll = () => {
    void queryClient.invalidateQueries({ queryKey: ['maintenance'] })
    void queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    void queryClient.invalidateQueries({ queryKey: ['fleet_kpi_summary'] })
    void refetch()
  }

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase()
    return data.filter((row) => {
      const matchesSearch =
        !term ||
        (row.vehicles?.name ?? '').toLowerCase().includes(term) ||
        (row.vehicles?.license_plate ?? '').toLowerCase().includes(term) ||
        row.service_type.toLowerCase().includes(term) ||
        (row.mechanic ?? '').toLowerCase().includes(term)

      let rowStatus = 'Open'
      if (row.is_completed) rowStatus = 'Completed'
      else if (row.mechanic) rowStatus = 'In Progress'

      const matchesStatus = statusFilter === 'All' || rowStatus === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [data, search, statusFilter])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance & Service"
        subtitle="Track repairs and keep vehicles out of rotation while In Shop"
        actionLabel="+ Log Service"
        onAction={() => setDialogOpen(true)}
      />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicle, service, mechanic…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <MaintenanceTable rows={filteredRows} isLoading={isLoading} onRefresh={refreshAll} />

      <MaintenanceFormDialog open={dialogOpen} onOpenChange={setDialogOpen} vehicles={vehicles} onSuccess={refreshAll} />
    </div>
  )
}
