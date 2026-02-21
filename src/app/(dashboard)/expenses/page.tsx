'use client'

import { useMemo, useState } from 'react'
import { ExpenseTable } from "@/components/expenses/ExpenseTable"
import { ExpenseFormDialog } from "@/components/expenses/ExpenseFormDialog"
import { PageHeader } from "@/components/layout/PageHeader"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useExpenses } from '@/lib/hooks/useExpenses'
import { useTrips } from '@/lib/hooks/useTrips'
import { useQueryClient } from '@tanstack/react-query'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ExpensesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [vehicleFilter, setVehicleFilter] = useState('All')
  const { data = [], isLoading, refetch } = useExpenses()
  const { data: trips = [] } = useTrips()
  const queryClient = useQueryClient()
  const completedTrips = trips.filter((trip) => trip.status === 'Completed')

  const refreshAll = () => {
    void queryClient.invalidateQueries({ queryKey: ['expenses'] })
    void queryClient.invalidateQueries({ queryKey: ['vehicle_cost_summary'] })
    void queryClient.invalidateQueries({ queryKey: ['analytics'] })
    void refetch()
  }

  // Unique vehicle names for filter dropdown
  const vehicleNames = useMemo(() => {
    const names = new Set(data.map((r) => r.vehicles?.name).filter(Boolean) as string[])
    return Array.from(names).sort((a, b) => a.localeCompare(b))
  }, [data])

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase()
    return data.filter((row) => {
      const matchesSearch =
        !term ||
        (row.vehicles?.name ?? '').toLowerCase().includes(term) ||
        (row.vehicles?.license_plate ?? '').toLowerCase().includes(term) ||
        (row.trips?.origin ?? '').toLowerCase().includes(term) ||
        (row.trips?.destination ?? '').toLowerCase().includes(term) ||
        (row.trips?.drivers?.full_name ?? '').toLowerCase().includes(term)
      const matchesVehicle = vehicleFilter === 'All' || row.vehicles?.name === vehicleFilter
      return matchesSearch && matchesVehicle
    })
  }, [data, search, vehicleFilter])

  // Summary totals
  const totalFuel = filteredRows.reduce((s, r) => s + (r.total_cost ?? 0), 0)
  const totalMisc = filteredRows.reduce((s, r) => s + (r.misc_expense ?? 0), 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trip & Expense"
        subtitle="Log fuel, tolls, and operational expenses per trip"
        actionLabel="+ Log Expense"
        onAction={() => setDialogOpen(true)}
      />

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-md border px-4 py-3">
          <p className="text-xs text-muted-foreground">Total Fuel Cost</p>
          <p className="text-xl font-semibold">₹ {totalFuel.toLocaleString()}</p>
        </div>
        <div className="rounded-md border px-4 py-3">
          <p className="text-xs text-muted-foreground">Total Misc Expenses</p>
          <p className="text-xl font-semibold">₹ {totalMisc.toLocaleString()}</p>
        </div>
        <div className="rounded-md border px-4 py-3">
          <p className="text-xs text-muted-foreground">Grand Total</p>
          <p className="text-xl font-semibold">₹ {(totalFuel + totalMisc).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicle, route, driver…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All Vehicles" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Vehicles</SelectItem>
            {vehicleNames.map((name) => (
              <SelectItem key={name} value={name}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ExpenseTable rows={filteredRows} isLoading={isLoading} />

      <ExpenseFormDialog open={dialogOpen} onOpenChange={setDialogOpen} completedTrips={completedTrips} onSuccess={refreshAll} />
    </div>
  )
}
