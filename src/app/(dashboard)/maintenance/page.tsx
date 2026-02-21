'use client'

import { useState } from 'react'
import { MaintenanceTable } from "@/components/maintenance/MaintenanceTable"
import { MaintenanceFormDialog } from "@/components/maintenance/MaintenanceFormDialog"
import { PageHeader } from "@/components/layout/PageHeader"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function MaintenancePage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Maintenance Logs" 
        subtitle="Track vehicle service history and upcoming maintenance"
        actionLabel="+ Log Service"
        onAction={() => setDialogOpen(true)}
      />
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search logs, parts..." className="pl-9" />
        </div>
      </div>

      <MaintenanceTable />

      <MaintenanceFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
