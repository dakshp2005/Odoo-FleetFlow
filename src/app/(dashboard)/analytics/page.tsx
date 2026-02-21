import { MonthlyRevenueChart } from "@/components/analytics/MonthlyRevenueChart"
import { FuelEfficiencyTable } from "@/components/analytics/FuelEfficiencyTable"
import { VehicleROITable } from "@/components/analytics/VehicleROITable"
import { MonthlyFinancialSummary } from "@/components/analytics/MonthlyFinancialSummary"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Analytics & Reports" 
        subtitle="Deep dive into fleet efficiency, financial performance and operational trends"
        actionLabel="Export PDF"
      />
      
      <div className="grid gap-6 lg:grid-cols-2">
        <MonthlyRevenueChart />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Fuel Efficiency Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <FuelEfficiencyTable />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <VehicleROITable />
        <MonthlyFinancialSummary />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Metric Cards placeholders */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Revenue per KM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ 42.50</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Idle Time Avg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Safety Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
