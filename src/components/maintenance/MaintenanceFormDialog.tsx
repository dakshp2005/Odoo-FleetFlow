"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { maintenanceSchema } from "@/lib/utils/validators"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function MaintenanceFormDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const form = useForm({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      vehicle_id: "",
      service_type: "",
      cost: 0,
      service_date: new Date().toISOString().split('T')[0],
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
          <DialogTitle>Log Maintenance Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehicle Registration</Label>
            <Input id="vehicle" {...form.register("vehicle_id")} placeholder="KA-01-MH-1234" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Service Type</Label>
            <Input id="type" {...form.register("service_type")} placeholder="e.g. Engine Oil Change" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Estimated Cost (₹)</Label>
              <Input id="cost" type="number" {...form.register("cost")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Service Date</Label>
              <Input id="date" type="date" {...form.register("service_date")} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Log Service</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
