'use client'

import { useState } from 'react'
import { ExpenseTable } from "@/components/expenses/ExpenseTable"
import { ExpenseFormDialog } from "@/components/expenses/ExpenseFormDialog"
import { PageHeader } from "@/components/layout/PageHeader"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function ExpensesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Trip & Expense" 
        subtitle="Log fuel, tolls, and other operational expenses per trip"
        actionLabel="+ Add Expense"
        onAction={() => setDialogOpen(true)}
      />
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search trips, bills..." className="pl-9" />
        </div>
      </div>

      <ExpenseTable />

      <ExpenseFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
