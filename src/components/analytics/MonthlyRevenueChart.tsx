"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MonthlyFinancialSummaryRow } from "@/lib/types/database"

interface Props {
  data: MonthlyFinancialSummaryRow[]
}

export function MonthlyRevenueChart({ data }: Readonly<Props>) {
  const chartData = [...data].reverse().map((row) => ({
    month: (row.month_label ?? "").slice(0, 3),
    revenue: row.total_revenue ?? 0,
    expenses: (row.total_fuel_cost ?? 0) + (row.total_maintenance_cost ?? 0),
  }))
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-base font-medium">Monthly Financial Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 16, right: 24, left: 16, bottom: 0 }} barSize={18} barCategoryGap="45%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  border: '1px solid #e4e4e7',
                  fontSize: '12px'
                }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingBottom: '20px' }} />
              <Bar dataKey="revenue" name="Revenue" fill="#18181b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
