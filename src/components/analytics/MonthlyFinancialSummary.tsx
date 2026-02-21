import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function MonthlyFinancialSummary() {
  const data = [
    { month: "February 2026", revenue: "₹6,50,000", expenses: "₹4,40,000", profit: "₹2,10,000", margin: "32%" },
    { month: "January 2026", revenue: "₹5,90,000", expenses: "₹4,10,000", profit: "₹1,80,000", margin: "30%" },
    { month: "December 2025", revenue: "₹6,10,000", expenses: "₹4,20,000", profit: "₹1,90,000", margin: "31%" },
    { month: "November 2025", revenue: "₹4,80,000", expenses: "₹3,50,000", profit: "₹1,30,000", margin: "27%" },
  ]

  return (
    <div className="rounded-md border mt-6">
      <div className="px-4 py-3 border-b font-semibold bg-muted/30">Monthly Financial Summary</div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Expenses</TableHead>
            <TableHead>Net Profit</TableHead>
            <TableHead className="text-right">Profit Margin</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.month}>
              <TableCell className="font-medium">{item.month}</TableCell>
              <TableCell>{item.revenue}</TableCell>
              <TableCell className="text-red-500">{item.expenses}</TableCell>
              <TableCell className="font-semibold text-emerald-600">{item.profit}</TableCell>
              <TableCell className="text-right font-medium">{item.margin}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
