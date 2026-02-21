'use client'

import { useState } from 'react'
import { DriverTable } from "@/components/drivers/DriverTable"
import { DriverFormDialog } from "@/components/drivers/DriverFormDialog"
import { PageHeader } from "@/components/layout/PageHeader"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function DriversPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Driver Performance" 
        subtitle="Monitor driver safety scores, license validity and duty status"
        actionLabel="+ New Driver"
        onAction={() => setDialogOpen(true)}
      />
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search drivers, license..." className="pl-9" />
        </div>
      </div>

      <DriverTable />

      <DriverFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
