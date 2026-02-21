import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Users, Route, Receipt } from "lucide-react"

export function KPIStrip() {
  const kpis = [
    { title: "Total Vehicles", value: "42", icon: Truck, trend: "+2 this month" },
    { title: "Active Drivers", value: "38", icon: Users, trend: "4 on leave" },
    { title: "Trips Today", value: "12", icon: Route, trend: "3 in progress" },
    { title: "Fuel Expenses", value: "₹45,200", icon: Receipt, trend: "-12% vs last month" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className="text-xs text-muted-foreground">
              {kpi.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
