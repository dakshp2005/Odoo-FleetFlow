import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TRIP_STATUS_STYLES } from "@/lib/constants"
import { cn } from "@/lib/utils/cn"
import type { TripWithRelations } from "@/lib/types/database"

export function RecentTripsTable({ trips }: Readonly<{ trips: TripWithRelations[] }>) {
  if (trips.length === 0) {
    return <div className="rounded-md border p-6 text-sm text-muted-foreground">No trips found</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trip #</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips.map((trip) => (
            <TableRow key={trip.id}>
              <TableCell className="font-medium max-w-[120px] truncate">{trip.id}</TableCell>
              <TableCell>{trip.vehicles?.name ?? '-'}</TableCell>
              <TableCell>{trip.vehicles?.type ?? '-'}</TableCell>
              <TableCell>{trip.drivers?.full_name ?? '-'}</TableCell>
              <TableCell className="text-muted-foreground text-xs">{trip.origin} → {trip.destination}</TableCell>
              <TableCell>
                <Badge className={cn("font-normal", TRIP_STATUS_STYLES[trip.status])}>
                  {trip.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
