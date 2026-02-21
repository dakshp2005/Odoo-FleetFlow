import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function VehicleROITable() {
  const data = [
    { vehicle: "KA-01-MH-1234", revenue: "₹8.4L", cost: "₹1.2L", roi: "+245%", status: "Excellent" },
    { vehicle: "KA-01-MH-5678", revenue: "₹6.1L", cost: "₹2.4L", roi: "+155%", status: "Good" },
    { vehicle: "KA-01-MH-9012", revenue: "₹9.2L", cost: "₹1.8L", roi: "+410%", status: "Excellent" },
    { vehicle: "KA-01-NH-3456", revenue: "₹3.8L", cost: "₹3.1L", roi: "+22%", status: "Poor" },
  ]

  return (
    <div className="rounded-md border mt-6">
      <div className="px-4 py-3 border-b font-semibold bg-muted/30">Vehicle ROI Index</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>ROI %</TableHead>
            <TableHead className="text-right">Performance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.vehicle}>
              <TableCell className="font-medium">{item.vehicle}</TableCell>
              <TableCell>{item.revenue}</TableCell>
              <TableCell>{item.cost}</TableCell>
              <TableCell className="font-semibold text-emerald-600">{item.roi}</TableCell>
              <TableCell className="text-right">
                <span className={item.status === "Excellent" ? "text-emerald-600" : item.status === "Poor" ? "text-red-600" : ""}>
                  {item.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
