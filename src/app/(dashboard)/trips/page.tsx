'use client'

import { useState } from 'react'
import { TripTable } from "@/components/trips/TripTable"
import { TripFormDialog } from "@/components/trips/TripFormDialog"
import { PageHeader } from "@/components/layout/PageHeader"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TripsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

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
          <Input placeholder="Search trips, loads..." className="pl-9" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <TripTable />

      <TripFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
