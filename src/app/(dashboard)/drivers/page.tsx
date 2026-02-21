'use client'

import { useMemo, useState } from 'react'
import { DriverTable } from "@/components/drivers/DriverTable"
import { DriverFormDialog } from "@/components/drivers/DriverFormDialog"
import { PageHeader } from "@/components/layout/PageHeader"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Users, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react"
import { useDrivers } from '@/lib/hooks/useDrivers'
import type { DriverPerformanceSummary } from '@/lib/types/database'
import { useQueryClient } from '@tanstack/react-query'

export default function DriversPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [editingDriver, setEditingDriver] = useState<DriverPerformanceSummary | null>(null)
  const queryClient = useQueryClient()
  const { data = [], isLoading, refetch } = useDrivers()

  // KPI counts
  const kpi = useMemo(() => ({
    onDuty:       data.filter(d => d.status === 'On Duty').length,
    offDuty:      data.filter(d => d.status === 'Off Duty').length,
    suspended:    data.filter(d => d.status === 'Suspended').length,
    licenseIssues: data.filter(d => d.license_status !== 'Valid').length,
  }), [data])

  const filteredDrivers = useMemo(() => {
    const term = search.trim().toLowerCase()
    return data.filter((driver) => {
      const matchesSearch = !term ||
        driver.full_name.toLowerCase().includes(term) ||
        driver.license_number.toLowerCase().includes(term) ||
        (driver.phone ?? '').toLowerCase().includes(term)
      const matchesStatus = statusFilter === 'All' || driver.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [data, search, statusFilter])

  const handleDialogOpen = () => {
    setEditingDriver(null)
    setDialogOpen(true)
  }

  const handleEdit = (driver: DriverPerformanceSummary) => {
    setEditingDriver(driver)
    setDialogOpen(true)
  }

  const handleSuccess = () => {
    void queryClient.invalidateQueries({ queryKey: ['drivers'] })
    void queryClient.invalidateQueries({ queryKey: ['driver_performance_summary'] })
    void refetch()
  }

  const kpiCards = [
    {
      label: 'On Duty',
      value: kpi.onDuty,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Off Duty',
      value: kpi.offDuty,
      icon: Users,
      color: 'text-zinc-500',
      bg: 'bg-zinc-50',
    },
    {
      label: 'Suspended',
      value: kpi.suspended,
      icon: ShieldAlert,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'License Issues',
      value: kpi.licenseIssues,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Driver Performance" 
        subtitle="Monitor driver safety scores, license validity and duty status"
        actionLabel="+ New Driver"
        onAction={handleDialogOpen}
      />

      {/* KPI Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {kpiCards.map((card) => (
          <Card key={card.label} className="border shadow-none">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`${card.bg} rounded-lg p-2.5`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, license, phone..."
            className="pl-9"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Duty Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="On Duty">On Duty</SelectItem>
            <SelectItem value="Off Duty">Off Duty</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DriverTable
        drivers={filteredDrivers}
        isLoading={isLoading}
        onEdit={handleEdit}
        onRefresh={handleSuccess}
      />

      <DriverFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingDriver={editingDriver}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
