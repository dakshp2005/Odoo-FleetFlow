import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("monthly_financial_summary")
    .select("month_label,total_revenue,total_fuel_cost,total_maintenance_cost,net_profit")
    .order("month_label", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const header = ["Month", "Revenue", "Fuel Cost", "Maintenance", "Net Profit"]
  const rows = (data ?? []).map((row) => [
    row.month_label,
    row.total_revenue ?? 0,
    row.total_fuel_cost ?? 0,
    row.total_maintenance_cost ?? 0,
    row.net_profit ?? 0,
  ])

  const csv = [header, ...rows]
    .map((line) => line.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n")

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=monthly_financial_summary.csv",
    },
  })
}
