import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { VehicleFuelEfficiency } from "@/lib/types/database"
import { Fuel } from "lucide-react"

interface Props {
  data: VehicleFuelEfficiency[]
  isLoading?: boolean
}

function getGrade(row: VehicleFuelEfficiency): { label: string; className: string } {
  // No completed trips with distance yet — but fuel IS being tracked
  if (row.km_per_liter === 0 && row.total_liters > 0) {
    return { label: "Awaiting trips", className: "bg-zinc-100 text-zinc-500 border-0" }
  }
  if (row.km_per_liter === 0) {
    return { label: "No data", className: "bg-zinc-100 text-zinc-400 border-0" }
  }
  if (row.km_per_liter >= 3)   return { label: "Excellent",   className: "bg-emerald-100 text-emerald-700 border-0" }
  if (row.km_per_liter >= 2.5) return { label: "Good",         className: "bg-blue-100 text-blue-700 border-0" }
  if (row.km_per_liter >= 2)   return { label: "Sub-optimal",  className: "bg-amber-100 text-amber-700 border-0" }
  return { label: "Gas Guzzler", className: "bg-red-100 text-red-700 border-0" }
}

export function FuelEfficiencyTable({ data, isLoading }: Readonly<Props>) {
  if (isLoading) return <div className="text-sm text-muted-foreground p-4">Loading...</div>
  if (!data.length) return <div className="text-sm text-muted-foreground p-4">No fuel data available.</div>

  const allZero = data.every((r) => r.km_per_liter === 0)
  // When all km/L are 0, sort by liters consumed (most fuel spent first) to still show useful data
  const sorted = [...data].sort((a, b) =>
    allZero ? b.total_liters - a.total_liters : b.km_per_liter - a.km_per_liter
  )

  return (
    <div className="rounded-md border">
      {allZero && (
        <div className="px-4 py-2.5 bg-amber-50 border-b text-xs text-amber-700 flex items-center gap-1.5">
          <Fuel className="h-3.5 w-3.5 shrink-0" />
          Fuel spend is tracked. Km/L calculates automatically once trips are completed with odometer readings.
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">#</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Liters Used</TableHead>
            <TableHead>Km / Liter</TableHead>
            <TableHead>Cost / Km</TableHead>
            <TableHead className="text-right">Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row, i) => {
            const grade = getGrade(row)
            const hasKpl = row.km_per_liter > 0
            return (
              <TableRow key={row.id}>
                <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {row.total_liters > 0 ? (
                    <span className="flex items-center gap-1.5">
                      <Fuel className="h-3.5 w-3.5 text-blue-400" />
                      {row.total_liters.toLocaleString("en-IN")} L
                    </span>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {hasKpl ? (
                    <span className="flex items-center gap-1.5 text-sm">
                      {row.km_per_liter.toFixed(1)} km/L
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Needs trip data</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {hasKpl ? `₹ ${row.cost_per_km?.toFixed(2)} / km` : <span className="text-zinc-400">—</span>}
                </TableCell>
                <TableCell className="text-right">
                  <Badge className={grade.className}>{grade.label}</Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
