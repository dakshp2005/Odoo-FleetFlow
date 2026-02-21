"use client";

import { useState } from "react";
import { VehicleTable } from "@/components/vehicles/VehicleTable";
import { VehicleFormDialog } from "@/components/vehicles/VehicleFormDialog";
import { PageHeader } from "@/components/layout/PageHeader";

export default function VehiclesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicle Registry"
        subtitle="Manage your fleet assets, status and registration"
        actionLabel="+ Add Vehicle"
        onAction={() => setDialogOpen(true)}
      />
      <VehicleTable />
      <VehicleFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
