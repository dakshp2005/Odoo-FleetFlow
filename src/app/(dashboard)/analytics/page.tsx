"use client"

import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAnalytics } from "@/lib/hooks/useAnalytics"
import { formatLakhs } from "@/lib/utils/formatters"
import type {
  MonthlyFinancialSummaryRow,
  VehicleCostSummary,
  Vehicle,
} from "@/lib/types/database"
import type { RawFuelLog } from "@/lib/hooks/useAnalytics"
import { MonthlyRevenueChart } from "@/components/analytics/MonthlyRevenueChart"
import { VehicleROITable } from "@/components/analytics/VehicleROITable"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import {
  Fuel,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  FileDown,
  FileText,
  Truck,
} from "lucide-react"

// ── Helpers (outside component to reduce cognitive complexity) ────────

interface CsvInput {
  monthly:     MonthlyFinancialSummaryRow[]
  fuelLogs:    RawFuelLog[]
  costSummary: VehicleCostSummary[]
  deadStock:   Pick<Vehicle, 'id' | 'name' | 'status'>[]
}

function buildCsvReport({ monthly, fuelLogs, costSummary, deadStock }: CsvInput): string {
  const rows = [
    "FLEETFLOW ANALYTICS REPORT",
    `Generated: ${new Date().toLocaleString("en-IN")}`,
    "",
    "MONTHLY FINANCIAL SUMMARY",
    "Month,Revenue (Rs),Fuel Cost (Rs),Maintenance (Rs),Net Profit (Rs)",
    ...monthly.map((r) =>
      `"${r.month_label}",${r.total_revenue ?? 0},${r.total_fuel_cost ?? 0},${r.total_maintenance_cost ?? 0},${r.net_profit ?? 0}`
    ),
    "",
    "FUEL EFFICIENCY PER TRIP",
    "Date,Vehicle,Liters,Distance (km),Km per Liter,Cost per Km (Rs)",
    ...fuelLogs
      .filter((l) => l.trips?.distance_km && l.liters > 0)
      .map((l) => {
        const km   = l.trips?.distance_km ?? 0
        const kpl  = km > 0 ? (km / l.liters).toFixed(2) : ""
        const cpk  = km > 0 ? (l.total_cost / km).toFixed(2) : ""
        return `"${l.fuel_date}","${l.trips?.vehicles?.name ?? ""}",${l.liters},${km},${kpl},${cpk}`
      }),
    "",
    "VEHICLE ROI INDEX",
    "Vehicle,Revenue (Rs),Fuel Cost (Rs),Maintenance Cost (Rs),ROI %",
    ...costSummary.map((r) =>
      `"${r.name}",${r.total_revenue ?? 0},${r.total_fuel_cost ?? 0},${r.total_maintenance_cost ?? 0},${(r.roi_percentage ?? 0).toFixed(1)}`
    ),
    "",
    "DEAD STOCK (Idle 30+ Days)",
    "Vehicle,Status",
    ...deadStock.map((v) => `"${v.name}","${v.status}"`),
  ]
  return rows.join("\n")
}

const LINE_COLORS = ["#2563eb","#16a34a","#dc2626","#9333ea","#d97706","#0891b2","#be185d"]

type FuelChartResult = {
  chartData: Record<string, number | string>[]
  vehicleNames: string[]
}

function buildFuelChartData(fuelLogs: RawFuelLog[]): FuelChartResult {
  const vehicleNamesSet = new Set<string>()
  const pointsByDate = new Map<string, Record<string, number>>()

  for (const log of fuelLogs) {
    const distKm = log.trips?.distance_km
    const vName  = log.trips?.vehicles?.name
    if (!vName || !distKm || distKm <= 0 || log.liters <= 0) continue
    vehicleNamesSet.add(vName)
    const entry = pointsByDate.get(log.fuel_date) ?? {}
    entry[vName] = Number.parseFloat((distKm / log.liters).toFixed(2))
    pointsByDate.set(log.fuel_date, entry)
  }

  const chartData = Array.from(pointsByDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({ date, ...vals }))

  return { chartData, vehicleNames: Array.from(vehicleNamesSet) }
}

function FuelEfficiencyLineChart({
  fuelLogs,
  isLoading,
}: Readonly<{ fuelLogs: RawFuelLog[]; isLoading: boolean }>) {
  if (isLoading) return <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Loading…</div>

  const { chartData, vehicleNames } = buildFuelChartData(fuelLogs)

  if (!chartData.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
        <Fuel className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          No efficiency data yet. Complete trips using the <strong>Send On Way</strong> (start odometer) → <strong>Complete</strong> (end odometer) flow.
        </p>
      </div>
    )
  }

  const allKpl = chartData.flatMap((row) =>
    vehicleNames.map((n) => row[n]).filter((v): v is number => typeof v === "number")
  )
  const avgKpl = allKpl.length ? Number.parseFloat((allKpl.reduce((s, v) => s + v, 0) / allKpl.length).toFixed(2)) : null

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <YAxis unit=" km/L" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v: number, name: string) => [`${v} km/L`, name]}
          contentStyle={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e4e4e7", fontSize: "12px" }}
        />
        <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />

        {/* threshold reference lines */}
        <ReferenceLine y={4} stroke="#16a34a" strokeDasharray="6 3" strokeWidth={1.5}
          label={{ value: "Good (4)", position: "insideTopRight", fontSize: 10, fill: "#16a34a" }} />
        <ReferenceLine y={2.5} stroke="#f59e0b" strokeDasharray="6 3" strokeWidth={1.5}
          label={{ value: "Avg (2.5)", position: "insideBottomRight", fontSize: 10, fill: "#f59e0b" }} />
        {avgKpl !== null && (
          <ReferenceLine y={avgKpl} stroke="#6366f1" strokeDasharray="4 4" strokeWidth={1}
            label={{ value: `Fleet avg (${avgKpl})`, position: "insideTopLeft", fontSize: 10, fill: "#6366f1" }} />
        )}

        {vehicleNames.map((name, i) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            stroke={LINE_COLORS[i % LINE_COLORS.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

function MonthlyTableContent({
  isLoading,
  monthly,
}: Readonly<{ isLoading: boolean; monthly: MonthlyFinancialSummaryRow[] }>) {
  if (isLoading) return <div className="text-sm text-muted-foreground">Loading…</div>
  if (!monthly.length) return <div className="text-sm text-muted-foreground">No monthly data available yet.</div>
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Month</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead>Fuel Cost</TableHead>
          <TableHead>Maintenance</TableHead>
          <TableHead>Total Expenses</TableHead>
          <TableHead className="text-right">Net Profit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {monthly.map((row) => {
          const totalExp = (row.total_fuel_cost ?? 0) + (row.total_maintenance_cost ?? 0)
          const net = row.net_profit ?? 0
          return (
            <TableRow key={row.month_label}>
              <TableCell className="font-medium">{row.month_label}</TableCell>
              <TableCell className="text-emerald-600">{formatLakhs(row.total_revenue ?? 0)}</TableCell>
              <TableCell className="text-red-500">{formatLakhs(row.total_fuel_cost ?? 0)}</TableCell>
              <TableCell className="text-red-500">{formatLakhs(row.total_maintenance_cost ?? 0)}</TableCell>
              <TableCell className="text-red-500">{formatLakhs(totalExp)}</TableCell>
              <TableCell className={`text-right font-semibold ${net >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {formatLakhs(net)}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics()

  // ── KPI computations ───────────────────────────────────────────────
  const totalFuelCost   = data?.costSummary.reduce((s, r) => s + (r.total_fuel_cost ?? 0), 0) ?? 0
  const totalRevenue    = data?.costSummary.reduce((s, r) => s + (r.total_revenue ?? 0), 0) ?? 0
  const totalMaintCost  = data?.costSummary.reduce((s, r) => s + (r.total_maintenance_cost ?? 0), 0) ?? 0
  const fleetRoi = data?.costSummary.length
    ? data.costSummary.reduce((s, r) => s + (r.roi_percentage ?? 0), 0) / data.costSummary.length
    : 0
  const utilizationRate = data?.fleetKpi.utilization_rate ?? 0
  const deadStockCount  = data?.deadStock.length ?? 0
  const netProfit       = totalRevenue - totalFuelCost - totalMaintCost

  // ── CSV Export ─────────────────────────────────────────────────────
  function exportCsv() {
    const csv = buildCsvReport({
      monthly:     data?.monthly     ?? [],
      fuelLogs:    data?.fuelLogs    ?? [],
      costSummary: data?.costSummary ?? [],
      deadStock:   data?.deadStock   ?? [],
    })
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href     = url
    a.download = `FleetFlow_Report_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8 print:space-y-6">
      <PageHeader
        title="Analytics & Reports"
        subtitle="Fleet performance insights, fuel efficiency, ROI, and financial summaries"
      />

      {/* ── Export buttons ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 print:hidden">
        <Button variant="outline" size="sm" onClick={() => { globalThis.window?.print() }} className="gap-2">
          <FileText className="h-4 w-4" />
          Export PDF
        </Button>
        <Button variant="outline" size="sm" onClick={exportCsv} className="gap-2">
          <FileDown className="h-4 w-4" />
          Export Excel / CSV
        </Button>
      </div>

      {/* ── KPI Strip ─────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Fuel Spend</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatLakhs(totalFuelCost)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all vehicles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatLakhs(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Net: <span className={netProfit >= 0 ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>{formatLakhs(netProfit)}</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg Fleet ROI</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${fleetRoi >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {fleetRoi >= 0 ? "+" : ""}{fleetRoi.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Utilization: {utilizationRate.toFixed(0)}%</p>
          </CardContent>
        </Card>

        <Card className={deadStockCount > 0 ? "border-amber-200 bg-amber-50/40" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Dead Stock</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${deadStockCount > 0 ? "text-amber-500" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${deadStockCount > 0 ? "text-amber-600" : ""}`}>
              {deadStockCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Vehicles idle 30+ days</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Monthly Financial Overview ─────────────────────────────── */}
      <MonthlyRevenueChart data={data?.monthly ?? []} />

      {/* ── Fuel Efficiency Line Chart ─────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Fuel className="h-4 w-4 text-blue-500" />
            Fuel Efficiency per Vehicle
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Km per liter computed from actual trip distances and fuel logs. Each point = one refuel entry.
          </p>
        </CardHeader>
        <CardContent className="h-[320px]">
          <FuelEfficiencyLineChart fuelLogs={data?.fuelLogs ?? []} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* ── Vehicle ROI ───────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Vehicle ROI Index
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Revenue earned vs fuel + maintenance spent per vehicle. Ranked best to worst.
          </p>
        </CardHeader>
        <CardContent>
          <VehicleROITable data={data?.costSummary ?? []} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* ── Dead Stock Alerts ─────────────────────────────────────── */}
      <Card className={deadStockCount > 0 ? "border-amber-200" : "border-emerald-200"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <AlertTriangle className={`h-4 w-4 ${deadStockCount > 0 ? "text-amber-500" : "text-emerald-500"}`} />
              Dead Stock Alerts
            </CardTitle>
            {deadStockCount > 0 && (
              <Badge className="bg-amber-100 text-amber-700 border-0">{deadStockCount} vehicles idle</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Vehicles with no trips recorded in the last 30 days — consider re-assigning or selling.
          </p>
        </CardHeader>
        <CardContent>
          {deadStockCount === 0 ? (
            <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
              <CheckCircle2 className="h-4 w-4" />
              All vehicles are actively being used. No dead stock detected.
            </div>
          ) : (
            <div className="space-y-2">
              {(data?.deadStock ?? []).map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Truck className="h-4 w-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="font-medium text-sm">{vehicle.name}</div>
                      <div className="text-xs text-muted-foreground">{vehicle.status}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">30+ days idle</Badge>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      → Assign more trips or consider selling
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Monthly Financial Summary Table ───────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Monthly Financial Summary</CardTitle>
          <p className="text-sm text-muted-foreground">Revenue, costs, and net profit per month</p>
        </CardHeader>
        <CardContent>
          <MonthlyTableContent isLoading={isLoading} monthly={data?.monthly ?? []} />
        </CardContent>
      </Card>
    </div>
  )
}
