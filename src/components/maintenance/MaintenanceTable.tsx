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

export function MaintenanceTable() {
  const records = [
    { id: "M-5001", vehicle: "KA-01-MH-1234", type: "Scheduled", service: "Engine Oil Change", cost: "₹8,500", date: "15/02/2026", status: "Completed" },
    { id: "M-5002", vehicle: "KA-01-MH-5678", type: "Repair", service: "Brake Pad Replacement", cost: "₹12,200", date: "22/02/2026", status: "Pending" },
    { id: "M-5003", vehicle: "KA-01-MH-9012", type: "Emergency", service: "Tyre Burst Recovery", cost: "₹24,000", date: "10/02/2026", status: "Completed" },
    { id: "M-5004", vehicle: "KA-01-NH-3456", type: "Scheduled", service: "Annual Fitness Check", cost: "₹15,000", date: "25/02/2026", status: "Scheduled" },
  ]

  const statusStyles: Record<string, string> = {
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Pending':   'bg-amber-50  text-amber-700  border-amber-200',
    'Scheduled': 'bg-blue-50   text-blue-700   border-blue-200',
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Log ID</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Service Detail</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.id}</TableCell>
              <TableCell>{log.vehicle}</TableCell>
              <TableCell>{log.type}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{log.service}</span>
                  <span className="text-xs text-muted-foreground">{log.date}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={cn("font-normal border", statusStyles[log.status])}>
                  {log.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">{log.cost}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
