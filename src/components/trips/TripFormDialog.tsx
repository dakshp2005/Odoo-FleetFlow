"use client"

import { useMemo, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { tripSchema } from "@/lib/utils/validators"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { Driver, Vehicle } from "@/lib/types/database"
import { z } from "zod"

type TripFormValues = z.infer<typeof tripSchema>

export function TripFormDialog({
  open,
  onOpenChange,
  vehicles,
  drivers,
  onSuccess,
}: Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicles: Vehicle[]
  drivers: Driver[]
  onSuccess: () => void
}>) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      vehicle_id: "",
      driver_id: "",
      origin: "",
      destination: "",
      cargo_weight_kg: 0,
      estimated_fuel_cost: 0,
      cargo_description: "",
    },
  })

  // useWatch creates proper reactive subscriptions — form.watch() inside useMemo
  // doesn't work because `form` is a stable reference and never triggers re-memoization.
  const watchedVehicleId = useWatch({ control: form.control, name: "vehicle_id" })
  const watchedDriverId  = useWatch({ control: form.control, name: "driver_id" })
  const watchedCargoWeight = useWatch({ control: form.control, name: "cargo_weight_kg" })

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === watchedVehicleId),
    [vehicles, watchedVehicleId],
  )

  const cargoWeight = Number(watchedCargoWeight) || 0
  const maxCapacity = selectedVehicle?.max_capacity_kg ?? null
  const overBy = maxCapacity !== null && cargoWeight > maxCapacity ? cargoWeight - maxCapacity : 0
  const capacityPct = maxCapacity ? Math.min((cargoWeight / maxCapacity) * 100, 100) : 0

  let barColor = "bg-green-500"
  if (overBy > 0) {
    barColor = "bg-red-500"
  } else if (capacityPct > 80) {
    barColor = "bg-amber-500"
  }

  const eligibleVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.status === "Available"),
    [vehicles],
  )

  const eligibleDrivers = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]

    return drivers.filter(
      (driver) =>
        driver.status !== "Suspended" &&
        driver.status !== "On Duty" &&
        driver.license_expiry > today,
    )
  }, [drivers])

  const onSubmit = async (values: TripFormValues) => {
    if (selectedVehicle && values.cargo_weight_kg > selectedVehicle.max_capacity_kg) {
      const over = values.cargo_weight_kg - selectedVehicle.max_capacity_kg
      const message = `Exceeds limit by ${over.toLocaleString()} kg (max ${selectedVehicle.max_capacity_kg.toLocaleString()} kg)`
      form.setError("cargo_weight_kg", { message })
      toast.error(message)
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data: newTrip, error: insertError } = await supabase
        .from("trips")
        .insert({
          vehicle_id: values.vehicle_id,
          driver_id: values.driver_id,
          origin: values.origin,
          destination: values.destination,
          cargo_weight_kg: values.cargo_weight_kg,
          estimated_fuel_cost: values.estimated_fuel_cost || null,
          cargo_description: values.cargo_description || null,
          status: "Pending",
        })
        .select("id")
        .single()

      if (insertError) {
        toast.error(`Failed to create trip: ${insertError.message}`)
        return
      }

      const { error: dispatchError } = await supabase
        .from("trips")
        .update({ status: "On Way" })
        .eq("id", newTrip.id)

      if (dispatchError) {
        toast.error(`Trip created but dispatch failed: ${dispatchError.message}`)
        return
      }

      // Keep vehicle and driver statuses in sync with the active trip
      const [{ error: vehicleErr }, { error: driverErr }] = await Promise.all([
        supabase
          .from("vehicles")
          .update({ status: "On Trip" })
          .eq("id", values.vehicle_id),
        supabase
          .from("drivers")
          .update({ status: "On Duty" })
          .eq("id", values.driver_id),
      ])

      if (vehicleErr) toast.warning(`Trip sent but vehicle status update failed: ${vehicleErr.message}`)
      if (driverErr) toast.warning(`Trip sent but driver status update failed: ${driverErr.message}`)

      toast.success("Trip is now On Way")
      form.reset()
      onOpenChange(false)
      onSuccess()
    } catch {
      toast.error("Unexpected error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Trip</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Vehicle</Label>
            <Select value={watchedVehicleId ?? ""} onValueChange={(value) => form.setValue("vehicle_id", value, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select available vehicle" />
              </SelectTrigger>
              <SelectContent>
                {eligibleVehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.license_plate}) — {vehicle.type} — {vehicle.max_capacity_kg}kg
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-red-500">{form.formState.errors.vehicle_id?.message}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="cargo_weight_kg">Cargo Weight (kg)</Label>
              {maxCapacity !== null && (
                <span className={`text-xs font-medium ${
                  overBy > 0 ? "text-red-500" : "text-muted-foreground"
                }`}>
                  {overBy > 0
                    ? `Exceeds limit by ${overBy.toLocaleString()} kg`
                    : `Max: ${maxCapacity.toLocaleString()} kg`}
                </span>
              )}
            </div>
            <Input
              id="cargo_weight_kg"
              type="number"
              min={0}
              max={maxCapacity ?? undefined}
              className={overBy > 0 ? "border-red-500 focus-visible:ring-red-500" : ""}
              {...form.register("cargo_weight_kg", { valueAsNumber: true })}
            />
            {maxCapacity !== null && cargoWeight > 0 && (
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${barColor}`}
                  style={{ width: `${capacityPct}%` }}
                />
              </div>
            )}
            {overBy === 0 && (
              <p className="text-xs text-red-500">{form.formState.errors.cargo_weight_kg?.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Driver</Label>
            <Select value={watchedDriverId ?? ""} onValueChange={(value) => form.setValue("driver_id", value, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Select eligible driver" />
              </SelectTrigger>
              <SelectContent>
                {eligibleDrivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.full_name} — {driver.license_category} — Score: {Math.round(driver.safety_score)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-red-500">{form.formState.errors.driver_id?.message}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin Address</Label>
              <Input id="origin" {...form.register("origin")} />
              <p className="text-xs text-red-500">{form.formState.errors.origin?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" {...form.register("destination")} />
              <p className="text-xs text-red-500">{form.formState.errors.destination?.message}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated_fuel_cost">Estimated Fuel Cost</Label>
            <Input id="estimated_fuel_cost" type="number" {...form.register("estimated_fuel_cost")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cargo_description">Cargo Description</Label>
            <Textarea id="cargo_description" rows={2} {...form.register("cargo_description")} />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || overBy > 0}>
              {isLoading ? "Sending..." : "Confirm & Send On Way"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
