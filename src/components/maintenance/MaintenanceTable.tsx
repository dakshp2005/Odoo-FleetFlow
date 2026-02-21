import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { MaintenanceLog } from "@/lib/types/database"
import { Skeleton } from "@/components/ui/skeleton"

type MaintenanceRow = MaintenanceLog & {
  vehicles: { id: string; name: string; license_plate: string } | null
}

const statusStyles: Record<string, string> = {
  Open:        'bg-zinc-100   text-zinc-700   border-zinc-300',
  'In Progress': 'bg-amber-50 text-amber-700  border-amber-200',
  Completed:   'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export function MaintenanceTable({
  rows,
  isLoading,
  onRefresh,
}: Readonly<{
  rows: MaintenanceRow[]
  isLoading: boolean
  onRefresh: () => void
}>) {
  const markComplete = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('maintenance_logs')
      .update({ is_completed: true })
      .eq('id', id)

    if (error) {
      toast.error(`Failed to mark complete: ${error.message}`)
      return
    }

    toast.success('Service completed. Vehicle is now Available.')
    onRefresh()
  }

  const handleDelete = async (row: MaintenanceRow) => {
    if (!row.is_completed) {
      toast.error('Only completed logs can be deleted. Mark it complete first.')
      return
    }

    if (!globalThis.confirm(`Delete service log for ${row.vehicles?.name ?? 'this vehicle'}?`)) return

    const supabase = createClient()
    const { error } = await supabase
      .from('maintenance_logs')
      .delete()
      .eq('id', row.id)

    if (error) {
      toast.error(`Failed to delete log: ${error.message}`)
      return
    }

    toast.success('Maintenance log removed')
    onRefresh()
  }

  if (isLoading) {
    return (
      <div className="rounded-md border p-4 space-y-3">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (rows.length === 0) {
    return <div className="rounded-md border p-6 text-sm text-muted-foreground">No maintenance logs found</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">#</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Issue / Service</TableHead>
            <TableHead>Mechanic</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => {
            let status = 'Open'
            if (row.is_completed) {
              status = 'Completed'
            } else if (row.mechanic) {
              status = 'In Progress'
            }
            const isPending = !row.is_completed

            return (
              <TableRow key={row.id}>
                <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                <TableCell>
                  <div className="font-medium">{row.vehicles?.name ?? '-'}</div>
                  <div className="text-xs text-muted-foreground">{row.vehicles?.license_plate ?? ''}</div>
                </TableCell>
                <TableCell>{row.service_type}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.mechanic ?? '—'}</TableCell>
                <TableCell>{row.service_date}</TableCell>
                <TableCell>₹ {row.cost.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge className={cn('font-normal border', statusStyles[status])}>{status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {isPending ? (
                      <Button size="sm" onClick={() => void markComplete(row.id)}>Mark Complete</Button>
                    ) : null}
                    <Button size="sm" variant="destructive" onClick={() => void handleDelete(row)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
