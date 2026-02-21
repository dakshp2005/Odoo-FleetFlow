import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { VEHICLE_STATUS_STYLES } from "@/lib/constants"
import { cn } from "@/lib/utils/cn"

export function VehicleTable() {
  const vehicles = [
    { id: "V-001", reg: "KA-01-MH-1234", model: "Tata Prima 4028.S", status: "Available", driver: "Ravi Kumar", mileage: "45,000 km" },
    { id: "V-002", reg: "KA-01-MH-5678", model: "Ashok Leyland 3123", status: "On Trip", driver: "Suresh Raina", mileage: "82,000 km" },
    { id: "V-003", reg: "KA-01-MH-9012", model: "BharatBenz 3523R", status: "In Shop", driver: "-", mileage: "12,500 km" },
    { id: "V-004", reg: "KA-01-NH-3456", model: "Tata LPT 1613", status: "Available", driver: "Mahesh Babu", mileage: "156,000 km" },
    { id: "V-005", reg: "KA-01-NH-7890", model: "Mahindra Blazo X 28", status: "Retired", driver: "-", mileage: "310,000 km" },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Registration</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned Driver</TableHead>
            <TableHead className="text-right">Total Mileage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">{vehicle.reg}</TableCell>
              <TableCell>{vehicle.model}</TableCell>
              <TableCell>
                <Badge className={cn("font-normal", VEHICLE_STATUS_STYLES[vehicle.status])}>
                  {vehicle.status}
                </Badge>
              </TableCell>
              <TableCell>{vehicle.driver}</TableCell>
              <TableCell className="text-right">{vehicle.mileage}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
