"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { tripSchema } from "@/lib/utils/validators"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

export function TripFormDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const form = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      vehicle_id: "",
      driver_id: "",
      origin: "",
      destination: "",
      cargo_weight: 0,
      start_date: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = (data: any) => {
    console.log(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule New Trip</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle</Label>
              <Input id="vehicle" {...form.register("vehicle_id")} placeholder="Select vehicle" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driver">Driver</Label>
              <Input id="driver" {...form.register("driver_id")} placeholder="Select driver" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input id="origin" {...form.register("origin")} placeholder="e.g. Mumbai" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" {...form.register("destination")} placeholder="e.g. Pune" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Cargo Weight (kg)</Label>
              <Input id="weight" type="number" {...form.register("cargo_weight")} />
              {form.formState.errors.cargo_weight && (
                <p className="text-xs text-red-500">{form.formState.errors.cargo_weight.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Start Date</Label>
              <Input id="date" type="date" {...form.register("start_date")} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Schedule Trip</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
