import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { VEHICLE_STATUS_STYLES } from "@/lib/constants"
import { cn } from "@/lib/utils/cn"
import type { Vehicle } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export function VehicleTable({
  vehicles,
  isLoading,
  onEdit,
  onRefresh,
}: Readonly<{
  vehicles: Vehicle[]
  isLoading: boolean
  onEdit: (vehicle: Vehicle) => void
  onRefresh: () => void
}>) {
  const handleDelete = async (vehicle: Vehicle) => {
    if (!globalThis.confirm(`Remove "${vehicle.name}"? This cannot be undone.`)) return

    const supabase = createClient()
    const { error } = await supabase.from("vehicles").delete().eq("id", vehicle.id)

    if (error) {
      if (error.code === "23503") {
        toast.error(`Cannot remove "${vehicle.name}" — it has linked trips or maintenance records. Retire it instead.`, { duration: 6000 })
      } else {
        toast.error(`Failed to remove: ${error.message}`)
      }
      return
    }

    toast.success(`"${vehicle.name}" removed`)
    onRefresh()
  }

  const retireVehicle = async (vehicle: Vehicle) => {
    if (vehicle.status === "On Trip") {
      toast.error("Cannot retire vehicle while it is On Trip")
      return
    }

    const supabase = createClient()
    const { error } = await supabase
      .from("vehicles")
      .update({ status: "Retired" })
      .eq("id", vehicle.id)

    if (error) {
      toast.error(`Failed to retire vehicle: ${error.message}`)
      return
    }

    toast.success(`${vehicle.name} retired`)
    onRefresh()
  }

  if (isLoading) {
    return (
      <div className="rounded-md border p-4 space-y-3">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (vehicles.length === 0) {
    return <div className="rounded-md border p-6 text-sm text-muted-foreground">No vehicles found</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">#</TableHead>
            <TableHead>Name / Model</TableHead>
            <TableHead>License Plate</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Max Payload</TableHead>
            <TableHead>Odometer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle, index) => (
            <TableRow key={vehicle.id}>
              <TableCell className="text-muted-foreground">{index + 1}</TableCell>
              <TableCell>
                <div className="font-medium">{vehicle.name}</div>
                {vehicle.model && (
                  <div className="text-xs text-muted-foreground">{vehicle.model}</div>
                )}
              </TableCell>
              <TableCell className="font-mono text-sm">{vehicle.license_plate}</TableCell>
              <TableCell>{vehicle.type}</TableCell>
              <TableCell>{vehicle.max_capacity_kg.toLocaleString()} kg</TableCell>
              <TableCell>{vehicle.odometer_km.toLocaleString()} km</TableCell>
              <TableCell>
                <Badge className={cn("font-normal", VEHICLE_STATUS_STYLES[vehicle.status])}>
                  {vehicle.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(vehicle)}>
                    Edit
                  </Button>
                  {vehicle.status !== "Retired" && (
                    <Button variant="outline" size="sm" onClick={() => void retireVehicle(vehicle)}>
                      Retire
                    </Button>
                  )}
                  <Button variant="destructive" size="sm" onClick={() => void handleDelete(vehicle)}>
                    Remove
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
