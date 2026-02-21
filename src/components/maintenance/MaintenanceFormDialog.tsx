"use client"

import { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { maintenanceSchema } from "@/lib/utils/validators"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import type { Vehicle } from "@/lib/types/database"
import { z } from "zod"

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>

export function MaintenanceFormDialog({
  open,
  onOpenChange,
  vehicles,
  onSuccess,
}: Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicles: Vehicle[]
  onSuccess: () => void
}>) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      vehicle_id: "",
      service_type: "",
      description: "",
      cost: 0,
      service_date: new Date().toISOString().split('T')[0],
      mechanic: "",
    },
  })

  const watchedVehicleId = useWatch({ control: form.control, name: "vehicle_id" })

  // Only show vehicles that are not currently On Trip — On Trip vehicles are unavailable
  const eligibleVehicles = vehicles.filter((v) => v.status !== "On Trip")

  const onSubmit = async (values: MaintenanceFormValues) => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('maintenance_logs')
        .insert({
          vehicle_id: values.vehicle_id,
          service_type: values.service_type,
          description: values.description || null,
          service_date: values.service_date,
          cost: values.cost,
          mechanic: values.mechanic || null,
        })

      if (error) {
        toast.error(`Failed to create service log: ${error.message}`)
        return
      }

      toast.success('Service log created. Vehicle status updated to In Shop.')
      form.reset()
      onOpenChange(false)
      onSuccess()
    } catch {
      toast.error('Unexpected error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Vehicle</Label>
            <Select
              value={watchedVehicleId ?? ""}
              onValueChange={(value) => form.setValue("vehicle_id", value, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                {eligibleVehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.license_plate})
                    {vehicle.status === "In Shop" ? " — Already In Shop" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.vehicle_id && (
              <p className="text-xs text-red-500">{form.formState.errors.vehicle_id.message}</p>
            )}
            {watchedVehicleId && vehicles.find((v) => v.id === watchedVehicleId)?.status !== "In Shop" && (
              <p className="text-xs text-amber-600">⚠ This vehicle will automatically be marked as In Shop once logged.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="service_type">Issue / Service Type</Label>
            <Input id="service_type" placeholder="e.g. Oil Change, Tire Replacement" {...form.register('service_type')} />
            {form.formState.errors.service_type && (
              <p className="text-xs text-red-500">{form.formState.errors.service_type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={2} {...form.register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service_date">Date</Label>
              <Input id="service_date" type="date" {...form.register('service_date')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Estimated Cost (₹)</Label>
              <Input id="cost" type="number" min={0} placeholder="0" {...form.register('cost', { valueAsNumber: true })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mechanic">Assigned Mechanic</Label>
            <Input id="mechanic" placeholder="Name or workshop" {...form.register('mechanic')} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging...' : 'Log Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
