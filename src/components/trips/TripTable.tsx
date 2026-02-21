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

export function TripTable() {
  const trips = [
    { id: "T-1001", vehicle: "KA-01-MH-1234", driver: "Ravi Kumar", origin: "Bangalore", destination: "Mumbai", status: "Dispatched", cargo: "Electronics", weight: "12,000 kg" },
    { id: "T-1002", vehicle: "KA-01-MH-5678", driver: "Suresh Raina", origin: "Bangalore", destination: "Chennai", status: "Completed", cargo: "Textiles", weight: "8,500 kg" },
    { id: "T-1003", vehicle: "KA-01-MH-9012", driver: "Mahesh Babu", origin: "Mumbai", destination: "Hyderabad", status: "Dispatched", cargo: "Machinery", weight: "15,000 kg" },
    { id: "T-1004", vehicle: "KA-01-NH-3456", driver: "Deepak Chahar", origin: "Chennai", destination: "Pune", status: "Draft", cargo: "Grains", weight: "10,000 kg" },
    { id: "T-1005", vehicle: "KA-01-NH-7890", driver: "Virat Kohli", origin: "Delhi", destination: "Faridabad", status: "Completed", cargo: "FMCG", weight: "5,000 kg" },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trip ID</TableHead>
            <TableHead>Vehicle & Driver</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Weight</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips.map((trip) => (
            <TableRow key={trip.id}>
              <TableCell className="font-medium">{trip.id}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{trip.vehicle}</span>
                  <span className="text-xs text-muted-foreground">{trip.driver}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <span>{trip.origin}</span>
                  <span className="text-muted-foreground">→</span>
                  <span>{trip.destination}</span>
                </div>
              </TableCell>
              <TableCell>{trip.cargo}</TableCell>
              <TableCell>
                <Badge className={cn("font-normal", TRIP_STATUS_STYLES[trip.status])}>
                  {trip.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{trip.weight}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
