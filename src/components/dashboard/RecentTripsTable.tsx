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

export function RecentTripsTable() {
  const trips = [
    { id: "T-1001", vehicle: "KA-01-MH-1234", driver: "Ravi Kumar", destination: "Mumbai", status: "Dispatched", date: "21/02/2026" },
    { id: "T-1002", vehicle: "KA-01-MH-5678", driver: "Suresh Raina", destination: "Chennai", status: "Completed", date: "20/02/2026" },
    { id: "T-1003", vehicle: "KA-01-MH-9012", driver: "Mahesh Babu", destination: "Hyderabad", status: "Dispatched", date: "21/02/2026" },
    { id: "T-1004", vehicle: "KA-01-NH-3456", driver: "Deepak Chahar", destination: "Pune", status: "Draft", date: "21/02/2026" },
    { id: "T-1005", vehicle: "KA-01-NH-7890", driver: "Virat Kohli", destination: "Delhi", status: "Completed", date: "19/02/2026" },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trip ID</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips.map((trip) => (
            <TableRow key={trip.id}>
              <TableCell className="font-medium">{trip.id}</TableCell>
              <TableCell>{trip.vehicle}</TableCell>
              <TableCell>{trip.driver}</TableCell>
              <TableCell>{trip.destination}</TableCell>
              <TableCell>
                <Badge className={cn("font-normal", TRIP_STATUS_STYLES[trip.status])}>
                  {trip.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{trip.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
