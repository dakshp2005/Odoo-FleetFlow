import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { VehicleCostSummary } from "@/lib/types/database"
import { formatLakhs } from "@/lib/utils/formatters"

interface Props {
  data: VehicleCostSummary[]
  isLoading?: boolean
}

function getRating(roi: number): { label: string; className: string } {
  if (roi >= 200) return { label: "Excellent", className: "bg-emerald-100 text-emerald-700 border-0" }
  if (roi >= 100) return { label: "Good", className: "bg-blue-100 text-blue-700 border-0" }
  if (roi >= 50)  return { label: "Average",  className: "bg-amber-100 text-amber-700 border-0" }
  if (roi >= 0)   return { label: "Poor",    className: "bg-orange-100 text-orange-700 border-0" }
  return { label: "Loss", className: "bg-red-100 text-red-700 border-0" }
}

export function VehicleROITable({ data, isLoading }: Readonly<Props>) {
  if (isLoading) return <div className="text-sm text-muted-foreground p-4">Loading...</div>
  if (!data.length) return <div className="text-sm text-muted-foreground p-4">No ROI data available.</div>

  const sorted = [...data].sort((a, b) => (b.roi_percentage ?? 0) - (a.roi_percentage ?? 0))

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">#</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Fuel Cost</TableHead>
            <TableHead>Maintenance</TableHead>
            <TableHead>ROI</TableHead>
            <TableHead className="text-right">Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row, i) => {
            const rating = getRating(row.roi_percentage ?? 0)
            const isNegative = (row.roi_percentage ?? 0) < 0
            return (
              <TableRow key={row.id}>
                <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-emerald-600">{formatLakhs(row.total_revenue ?? 0)}</TableCell>
                <TableCell className="text-red-500">{formatLakhs(row.total_fuel_cost ?? 0)}</TableCell>
                <TableCell className="text-red-500">{formatLakhs(row.total_maintenance_cost ?? 0)}</TableCell>
                <TableCell className={`font-semibold ${ isNegative ? "text-red-600" : "text-emerald-600" }`}>
                  {isNegative ? "" : "+"}{(row.roi_percentage ?? 0).toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">
                  <Badge className={rating.className}>{rating.label}</Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
