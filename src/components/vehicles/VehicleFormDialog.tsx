"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema } from "@/lib/utils/validators";
import { z } from "zod";
import type { Vehicle } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type VehicleFormValues = z.infer<typeof vehicleSchema>

export function VehicleFormDialog({
  open,
  onOpenChange,
  editingVehicle,
  onSuccess,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingVehicle: Vehicle | null;
  onSuccess: () => void;
}>) {
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(editingVehicle)
  let submitLabel = "Save Vehicle"
  if (loading) {
    submitLabel = "Saving..."
  } else if (isEditing) {
    submitLabel = "Update Vehicle"
  }

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: "",
      license_plate: "",
      model: "",
      type: "Truck",
      max_capacity_kg: 0,
      odometer_km: 0,
      status: "Available",
      acquisition_cost: 0,
      region: "",
    },
  })

  const watchedType   = useWatch({ control: form.control, name: "type" })
  const watchedStatus = useWatch({ control: form.control, name: "status" })

  useEffect(() => {
    if (editingVehicle) {
      form.reset({
        name: editingVehicle.name,
        license_plate: editingVehicle.license_plate,
        model: editingVehicle.model,
        type: editingVehicle.type,
        max_capacity_kg: editingVehicle.max_capacity_kg,
        odometer_km: editingVehicle.odometer_km,
        status: editingVehicle.status,
        acquisition_cost: editingVehicle.acquisition_cost ?? 0,
        region: editingVehicle.region ?? "",
      })
      return
    }

    form.reset({
      name: "",
      license_plate: "",
      model: "",
      type: "Truck",
      max_capacity_kg: 0,
      odometer_km: 0,
      status: "Available",
      acquisition_cost: 0,
      region: "",
    })
  }, [editingVehicle, form, open])

  /** Returns true and surfaces a field error when the plate is already taken. */
  const checkDuplicatePlate = async (plate: string, excludeId?: string): Promise<boolean> => {
    const supabase = createClient()
    let query = supabase.from("vehicles").select("id").eq("license_plate", plate).limit(1)
    if (excludeId) query = query.neq("id", excludeId)
    const { data } = await query
    if (data && data.length > 0) {
      form.setError("license_plate", {
        message: `License plate "${plate}" is already registered to another vehicle`,
      })
      toast.error("License plate already exists")
      return true
    }
    return false
  }

  /** Surfaces a plate-conflict field error for a Postgres 23505 response. */
  const handleDbError = (error: { code: string; message: string }, action: string) => {
    if (error.code === "23505") {
      form.setError("license_plate", { message: "License plate already registered" })
      toast.error("License plate already registered")
    } else {
      toast.error(`Failed to ${action} vehicle: ${error.message}`)
    }
  }

  const onSubmit = async (values: VehicleFormValues) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const isDuplicate = await checkDuplicatePlate(
        values.license_plate,
        isEditing && editingVehicle ? editingVehicle.id : undefined,
      )
      if (isDuplicate) return

      if (isEditing && editingVehicle) {
        const { error } = await supabase
          .from("vehicles")
          .update({
            name: values.name,
            license_plate: values.license_plate,
            model: values.model,
            type: values.type,
            max_capacity_kg: values.max_capacity_kg,
            odometer_km: values.odometer_km,
            status: values.status,
            acquisition_cost: values.acquisition_cost || null,
            region: values.region || null,
          })
          .eq("id", editingVehicle.id)

        if (error) { handleDbError(error, "update"); return }
        toast.success("Vehicle updated successfully")
      } else {
        const { error } = await supabase
          .from("vehicles")
          .insert({
            name: values.name,
            license_plate: values.license_plate,
            model: values.model,
            type: values.type,
            max_capacity_kg: values.max_capacity_kg,
            odometer_km: values.odometer_km,
            status: values.status,
            acquisition_cost: values.acquisition_cost || null,
            region: values.region || null,
          })

        if (error) { handleDbError(error, "add"); return }
        toast.success("Vehicle created successfully")
      }

      onOpenChange(false)
      form.reset()
      onSuccess()
    } catch {
      toast.error("Unexpected error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
          <DialogDescription>
            Enter the details of the vehicle asset.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vehicle Name</Label>
              <Input id="name" placeholder="e.g. Truck-01" {...form.register("name")} />
              <p className="text-xs text-red-500">{form.formState.errors.name?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="license_plate">License Plate</Label>
              <Input id="license_plate" placeholder="e.g. GJ01AB1234" {...form.register("license_plate")} />
              <p className="text-xs text-red-500">{form.formState.errors.license_plate?.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Vehicle Model</Label>
              <Input id="model" placeholder="e.g. Tata Prima" {...form.register("model")} />
              <p className="text-xs text-red-500">{form.formState.errors.model?.message}</p>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={watchedType} onValueChange={(value) => form.setValue("type", value as VehicleFormValues["type"], { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="Bike">Bike</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_capacity_kg">Max Payload (kg)</Label>
              <Input id="max_capacity_kg" type="number" min={0} placeholder="e.g. 5000" {...form.register("max_capacity_kg", { valueAsNumber: true })} />
              <p className="text-xs text-red-500">{form.formState.errors.max_capacity_kg?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="odometer_km">Current Odometer (km)</Label>
              <Input id="odometer_km" type="number" min={0} placeholder="e.g. 12000" {...form.register("odometer_km", { valueAsNumber: true })} />
              <p className="text-xs text-red-500">{form.formState.errors.odometer_km?.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={watchedStatus} onValueChange={(value) => form.setValue("status", value as VehicleFormValues["status"], { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="On Trip">On Trip</SelectItem>
                  <SelectItem value="In Shop">In Shop</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input id="region" placeholder="e.g. North Gujarat" {...form.register("region")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="acquisition_cost">Acquisition Cost (₹)</Label>
            <Input id="acquisition_cost" type="number" min={0} placeholder="e.g. 1500000" {...form.register("acquisition_cost", { valueAsNumber: true })} />
            <p className="text-xs text-red-500">{form.formState.errors.acquisition_cost?.message}</p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
