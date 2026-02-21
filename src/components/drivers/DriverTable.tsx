import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DRIVER_STATUS_STYLES, LICENSE_STATUS_STYLES } from "@/lib/constants"
import { cn } from "@/lib/utils/cn"

export function DriverTable() {
  const drivers = [
    { id: "D-2001", name: "Ravi Kumar", license: "Valid", status: "On Duty", safetyScore: "4.8", trips: 142 },
    { id: "D-2002", name: "Suresh Raina", license: "Expiring Soon", status: "Off Duty", safetyScore: "4.9", trips: 215 },
    { id: "D-2003", name: "Mahesh Babu", license: "Valid", status: "On Duty", safetyScore: "4.5", trips: 89 },
    { id: "D-2004", name: "Deepak Chahar", license: "Expired", status: "Suspended", safetyScore: "3.2", trips: 54 },
    { id: "D-2005", name: "Virat Kohli", license: "Valid", status: "Off Duty", safetyScore: "5.0", trips: 310 },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Driver Name</TableHead>
            <TableHead>License Status</TableHead>
            <TableHead>Current Status</TableHead>
            <TableHead>Safety Score</TableHead>
            <TableHead className="text-right">Total Trips</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow key={driver.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{driver.name}</span>
                  <span className="text-xs text-muted-foreground">{driver.id}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={cn("font-normal border", LICENSE_STATUS_STYLES[driver.license])}>
                  {driver.license}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={cn("font-normal", DRIVER_STATUS_STYLES[driver.status])}>
                  {driver.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        parseFloat(driver.safetyScore) > 4 ? "bg-emerald-500" : "bg-amber-500"
                      )} 
                      style={{ width: `${(parseFloat(driver.safetyScore) / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{driver.safetyScore}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">{driver.trips}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
