import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ExpenseRow } from "@/lib/hooks/useExpenses"
import { Skeleton } from "@/components/ui/skeleton"

export function ExpenseTable({
  rows,
  isLoading,
}: Readonly<{
  rows: ExpenseRow[]
  isLoading: boolean
}>) {
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
    return <div className="rounded-md border p-6 text-sm text-muted-foreground">No expense logs found</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">#</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Liters</TableHead>
            <TableHead>Fuel Cost</TableHead>
            <TableHead>Misc</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((expense, index) => {
            const total = (expense.total_cost ?? 0) + (expense.misc_expense ?? 0)
            return (
              <TableRow key={expense.id}>
                <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                <TableCell>
                  <div className="font-medium">{expense.vehicles?.name ?? '—'}</div>
                  <div className="text-xs text-muted-foreground">{expense.vehicles?.license_plate ?? ''}</div>
                </TableCell>
                <TableCell className="text-sm">
                  {expense.trips ? (
                    <span>{expense.trips.origin} → {expense.trips.destination}</span>
                  ) : '—'}
                  {expense.trips?.distance_km ? (
                    <div className="text-xs text-muted-foreground">{expense.trips.distance_km.toLocaleString()} km</div>
                  ) : null}
                </TableCell>
                <TableCell>{expense.trips?.drivers?.full_name ?? '—'}</TableCell>
                <TableCell>{expense.fuel_date}</TableCell>
                <TableCell>{expense.liters > 0 ? `${expense.liters.toLocaleString()} L` : '—'}</TableCell>
                <TableCell>₹ {expense.total_cost.toLocaleString()}</TableCell>
                <TableCell>₹ {(expense.misc_expense ?? 0).toLocaleString()}</TableCell>
                <TableCell className="font-semibold">₹ {total.toLocaleString()}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
