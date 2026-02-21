"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema } from "@/lib/utils/validators";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import type { TripWithRelations } from "@/lib/types/database";

type ExpenseFormValues = z.infer<typeof expenseSchema>

export function ExpenseFormDialog({
  open,
  onOpenChange,
  completedTrips,
  onSuccess,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completedTrips: TripWithRelations[];
  onSuccess: () => void;
}>) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      trip_id: "",
      liters: 0,
      total_cost: 0,
      misc_expense: 0,
      fuel_date: new Date().toISOString().split("T")[0],
    },
  });

  const watchedTripId    = useWatch({ control: form.control, name: "trip_id" })
  const watchedFuelCost  = useWatch({ control: form.control, name: "total_cost" })
  const watchedMisc      = useWatch({ control: form.control, name: "misc_expense" })

  const selectedTrip = useMemo(
    () => completedTrips.find((t) => t.id === watchedTripId),
    [completedTrips, watchedTripId],
  )

  const totalExpense = (Number(watchedFuelCost) || 0) + (Number(watchedMisc) || 0)

  const onSubmit = async (values: ExpenseFormValues) => {
    if (!selectedTrip) {
      form.setError("trip_id", { message: "Select a completed trip" })
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("fuel_logs")
        .insert({
          trip_id: values.trip_id,
          vehicle_id: selectedTrip.vehicle_id,
          liters: values.liters,
          total_cost: values.total_cost,
          misc_expense: values.misc_expense,
          fuel_date: values.fuel_date,
        })

      if (error) {
        toast.error(`Failed to log expense: ${error.message}`)
        return
      }

      toast.success("Expense logged successfully")
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Fuel & Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">

          {/* Trip selector */}
          <div className="space-y-2">
            <Label>Trip</Label>
            <Select
              value={watchedTripId ?? ""}
              onValueChange={(value) => form.setValue("trip_id", value, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select completed trip" />
              </SelectTrigger>
              <SelectContent>
                {completedTrips.map((trip) => (
                  <SelectItem key={trip.id} value={trip.id}>
                    {trip.vehicles?.name ?? "Vehicle"} — {trip.origin} → {trip.destination}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.trip_id && (
              <p className="text-xs text-red-500">{form.formState.errors.trip_id.message}</p>
            )}
          </div>

          {/* Trip info panel */}
          {selectedTrip && (
            <div className="rounded-md bg-muted/50 border px-3 py-2 text-sm grid grid-cols-2 gap-1">
              <span className="text-muted-foreground">Vehicle</span>
              <span className="font-medium">{selectedTrip.vehicles?.name} ({selectedTrip.vehicles?.license_plate})</span>
              <span className="text-muted-foreground">Driver</span>
              <span className="font-medium">{selectedTrip.drivers?.full_name ?? "—"}</span>
              <span className="text-muted-foreground">Route</span>
              <span className="font-medium">{selectedTrip.origin} → {selectedTrip.destination}</span>
              {selectedTrip.distance_km && (
                <>
                  <span className="text-muted-foreground">Distance</span>
                  <span className="font-medium">{selectedTrip.distance_km.toLocaleString()} km</span>
                </>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liters">Liters Filled</Label>
              <Input id="liters" type="number" min={0} step={0.01} placeholder="0.00"
                {...form.register("liters", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuel_date">Date</Label>
              <Input id="fuel_date" type="date" {...form.register("fuel_date")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_cost">Fuel Cost (₹)</Label>
              <Input id="total_cost" type="number" min={0} step={0.01} placeholder="0.00"
                {...form.register("total_cost", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="misc_expense">Misc Expense (₹)</Label>
              <Input id="misc_expense" type="number" min={0} step={0.01} placeholder="0.00"
                {...form.register("misc_expense", { valueAsNumber: true })} />
            </div>
          </div>

          {/* Total preview */}
          {totalExpense > 0 && (
            <div className="flex items-center justify-between rounded-md bg-muted/50 border px-3 py-2 text-sm">
              <span className="text-muted-foreground">Total Expense</span>
              <span className="font-semibold">₹ {totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Log Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
