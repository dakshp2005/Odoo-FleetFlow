import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TRIP_STATUS_STYLES } from "@/lib/constants"
import { cn } from "@/lib/utils/cn"
import type { TripWithRelations } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

/** Prompts for an odometer reading and returns the number, or null if cancelled/invalid. */
function promptOdometer(label: string): number | null {
  const entered = globalThis.window?.prompt(label)
  if (!entered) return null
  const parsed = Number(entered)
  if (Number.isNaN(parsed) || parsed < 0) {
    toast.error("Invalid odometer value")
    return null
  }
  return parsed
}

export function TripTable({
  trips,
  isLoading,
  onRefresh,
}: Readonly<{
  trips: TripWithRelations[]
  isLoading: boolean
  onRefresh: () => void
}>) {
  const updateTripStatus = async (trip: TripWithRelations, status: "Completed" | "Cancelled" | "On Way") => {
    const supabase = createClient()
    const payload: { status: string; start_odometer_km?: number; end_odometer_km?: number } = { status }

    if (status === "On Way") {
      const odo = promptOdometer("Enter start odometer reading (km)")
      if (odo === null) return
      payload.start_odometer_km = odo
    }

    if (status === "Completed") {
      const odo = promptOdometer("Enter end odometer reading (km)")
      if (odo === null) return
      payload.end_odometer_km = odo
      // distance_km is GENERATED ALWAYS AS (end_odometer_km - start_odometer_km) STORED
      // Postgres computes it automatically — do NOT include it in the payload
    }

    const { error } = await supabase
      .from("trips")
      .update(payload)
      .eq("id", trip.id)

    if (error) {
      toast.error(`Failed to update trip: ${error.message}`)
      return
    }

    // Sync vehicle and driver statuses to match trip lifecycle
    const isTerminal = status === "Completed" || status === "Cancelled"
    const vehicleStatus = isTerminal ? "Available" : "On Trip"
    const driverStatus = isTerminal ? "Available" : "On Duty"

    await Promise.all([
      trip.vehicle_id
        ? supabase.from("vehicles").update({ status: vehicleStatus }).eq("id", trip.vehicle_id)
        : Promise.resolve(),
      trip.driver_id
        ? supabase.from("drivers").update({ status: driverStatus }).eq("id", trip.driver_id)
        : Promise.resolve(),
    ])

    toast.success(`Trip #${trip.id} updated to ${status}`)
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

  if (trips.length === 0) {
    return <div className="rounded-md border p-6 text-sm text-muted-foreground">No trips found</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trip#</TableHead>
            <TableHead>Fleet Type</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips.map((trip) => (
            <TableRow key={trip.id}>
              <TableCell className="font-medium">{trip.id}</TableCell>
              <TableCell>{trip.vehicles?.type ?? "-"}</TableCell>
              <TableCell>{trip.origin}</TableCell>
              <TableCell>{trip.destination}</TableCell>
              <TableCell>
                <Badge className={cn("font-normal", TRIP_STATUS_STYLES[trip.status])}>
                  {trip.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {trip.status === "On Way" ? (
                    <>
                      <Button size="sm" onClick={() => void updateTripStatus(trip, "Completed")}>Complete</Button>
                      <Button size="sm" variant="outline" onClick={() => void updateTripStatus(trip, "Cancelled")}>Cancel</Button>
                    </>
                  ) : null}
                  {trip.status === "Pending" ? (
                    <Button size="sm" onClick={() => void updateTripStatus(trip, "On Way")}>Send On Way</Button>
                  ) : null}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
