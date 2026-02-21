"use client";

import { KPIStrip } from "@/components/dashboard/KPIStrip";
import { RecentTripsTable } from "@/components/dashboard/RecentTripsTable";
import { FleetStatusChart } from "@/components/dashboard/FleetStatusChart";
import { PageHeader } from "@/components/layout/PageHeader";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Command Center"
        subtitle="Overview of your fleet operations"
      />
      <KPIStrip />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTripsTable />
        </div>
        <FleetStatusChart />
      </div>
    </div>
  );
}
