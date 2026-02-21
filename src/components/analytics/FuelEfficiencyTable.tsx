import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function FuelEfficiencyTable() {
  const data = [
    { vehicle: "KA-01-MH-1234", model: "Tata Prima", efficiency: "3.2 km/L", costPerKm: "₹18.5", status: "Optimal" },
    { vehicle: "KA-01-MH-5678", model: "Ashok Leyland", efficiency: "2.8 km/L", costPerKm: "₹21.2", status: "Sub-optimal" },
    { vehicle: "KA-01-MH-9012", model: "BharatBenz", efficiency: "3.1 km/L", costPerKm: "₹19.1", status: "Optimal" },
    { vehicle: "KA-01-NH-3456", model: "Tata LPT", efficiency: "2.5 km/L", costPerKm: "₹24.0", status: "Needs Review" },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead>Efficiency</TableHead>
            <TableHead>Cost / Km</TableHead>
            <TableHead className="text-right">Condition</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.vehicle}>
              <TableCell className="font-medium">{item.vehicle}</TableCell>
              <TableCell>{item.efficiency}</TableCell>
              <TableCell>{item.costPerKm}</TableCell>
              <TableCell className="text-right">
                <span className={item.status === "Needs Review" ? "text-red-600 font-medium" : ""}>
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
