import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Wrench, Package, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function KPIStrip({
  activeFleet,
  maintenanceAlerts,
  pendingCargo,
  utilizationRate,
}: Readonly<{
  activeFleet: number
  maintenanceAlerts: number
  pendingCargo: number
  utilizationRate: number
}>) {
  const router = useRouter()

  const kpis = [
    { title: "Active Fleet", value: activeFleet, display: String(activeFleet), icon: Truck, hint: "Vehicles currently on the road" },
    { title: "Maintenance Alerts", value: maintenanceAlerts, display: String(maintenanceAlerts), icon: Wrench, hint: "Vehicles stuck in the shop" },
    { title: "Utilization Rate", value: utilizationRate, display: `${utilizationRate.toFixed(1)}%`, icon: TrendingUp, hint: "% of fleet actively working" },
    { title: "Pending Cargo", value: pendingCargo, display: String(pendingCargo), icon: Package, hint: "Deliveries waiting for a driver" },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.display}</div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex gap-2">
        <Button onClick={() => router.push('/trips?modal=open')}>New Trip</Button>
        <Button variant="outline" onClick={() => router.push('/vehicles?modal=open')}>New Vehicle</Button>
      </div>
    </div>
  )
}
