"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Available", value: 25, color: "#10b981" },
  { name: "On Trip", value: 12, color: "#3b82f6" },
  { name: "In Shop", value: 4, color: "#f59e0b" },
  { name: "Retired", value: 1, color: "#71717a" },
]

const legendFormatter = (value: string) => (
  <span className="text-xs font-medium text-muted-foreground">{value}</span>
)

export function FleetStatusChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-base font-medium">Fleet Status Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  border: '1px solid #e4e4e7',
                  fontSize: '12px'
                }} 
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={legendFormatter}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
