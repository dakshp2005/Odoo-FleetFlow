import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function ExpenseTable() {
  const expenses = [
    { id: "E-4001", tripId: "T-1001", vehicle: "KA-01-MH-1234", category: "Fuel", amount: "₹12,400", date: "21/02/2026", status: "Approved" },
    { id: "E-4002", tripId: "T-1001", vehicle: "KA-01-MH-1234", category: "Toll", amount: "₹1,200", date: "21/02/2026", status: "Approved" },
    { id: "E-4003", tripId: "T-1002", vehicle: "KA-01-MH-5678", category: "Fuel", amount: "₹8,900", date: "20/02/2026", status: "Pending" },
    { id: "E-4004", tripId: "T-1003", vehicle: "KA-01-MH-9012", category: "Repair", amount: "₹4,500", date: "21/02/2026", status: "Approved" },
    { id: "E-4005", tripId: "T-1002", vehicle: "KA-01-MH-5678", category: "Food", amount: "₹650", date: "20/02/2026", status: "Pending" },
  ]

  const statusStyles: Record<string, string> = {
    'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Pending':   'bg-amber-50  text-amber-700  border-amber-200',
    'Rejected':  'bg-red-50    text-red-700    border-red-200',
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Expense ID</TableHead>
            <TableHead>Trip & Vehicle</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.id}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{expense.tripId}</span>
                  <span className="text-xs text-muted-foreground">{expense.vehicle}</span>
                </div>
              </TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>
                <Badge className={statusStyles[expense.status]}>
                  {expense.status}
                </Badge>
              </TableCell>
              <TableCell>{expense.date}</TableCell>
              <TableCell className="text-right font-medium">{expense.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
