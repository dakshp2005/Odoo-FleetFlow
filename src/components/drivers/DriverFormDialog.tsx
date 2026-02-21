"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { driverSchema } from "@/lib/utils/validators";
import type { DriverPerformanceSummary } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type DriverFormValues = z.infer<typeof driverSchema>;

// ── license-status banner ─────────────────────────────────────────────────────

function getLicenseStatus(expiry: string) {
  if (!expiry) return null;
  const today = new Date();
  const exp = new Date(expiry);
  const diffDays = Math.ceil(
    (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays < 0)    return "Expired";
  if (diffDays <= 60)  return "Expiring Soon";
  return "Valid";
}

function scoreColor(score: number) {
  if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200"
  if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-200"
  return "bg-red-50 text-red-700 border-red-200"
}

function LicenseBanner({ expiry }: Readonly<{ expiry: string }>) {
  const status = getLicenseStatus(expiry);
  if (!status) return null;

  if (status === "Expired") {
    return (
      <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        <Lock className="h-4 w-4 shrink-0" />
        <span>
          <strong>License expired.</strong> Driver will be locked from all new
          trip assignments until renewed.
        </span>
      </div>
    );
  }
  if (status === "Expiring Soon") {
    return (
      <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>
          <strong>Expiring soon.</strong> Remind driver to renew before the
          date.
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      <span>License is <strong>Valid</strong>.</span>
    </div>
  );
}


export function DriverFormDialog({
  open,
  onOpenChange,
  editingDriver,
  onSuccess,
}: Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingDriver: DriverPerformanceSummary | null;
  onSuccess: () => void;
}>) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = Boolean(editingDriver);
  let submitLabel = "Add Driver"
  if (isLoading) {
    submitLabel = "Saving..."
  } else if (isEditing) {
    submitLabel = "Update Driver"
  }

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      license_number: "",
      license_expiry: "",
      license_category: "Truck",
      status: "Off Duty" as const,
      safety_score: 100,
      complaints: 0,
      notes: "",
    },
  });

  useEffect(() => {
    if (editingDriver) {
      form.reset({
        full_name: editingDriver.full_name,
        phone: editingDriver.phone ?? "",
        license_number: editingDriver.license_number,
        license_expiry: editingDriver.license_expiry,
        license_category: editingDriver.license_category,
        status: editingDriver.status,
        safety_score: editingDriver.safety_score,
        complaints: editingDriver.complaints,
        notes: editingDriver.notes ?? "",
      });
      return;
    }

    form.reset({
      full_name: "",
      phone: "",
      license_number: "",
      license_expiry: "",
      license_category: "Truck",
      status: "Off Duty",
      safety_score: 100,
      complaints: 0,
      notes: "",
    });
  }, [editingDriver, form, open]);

  // Reactive watched values — useWatch creates proper subscriptions
  const watchedExpiry    = useWatch({ control: form.control, name: "license_expiry" })
  const watchedCategory  = useWatch({ control: form.control, name: "license_category" })
  const watchedStatus    = useWatch({ control: form.control, name: "status" })
  const watchedScore     = useWatch({ control: form.control, name: "safety_score" })

  const onSubmit = async (values: DriverFormValues) => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      if (isEditing && editingDriver) {
        const { error } = await supabase
          .from("drivers")
          .update({
            full_name: values.full_name,
            phone: values.phone || null,
            license_number: values.license_number,
            license_expiry: values.license_expiry,
            license_category: values.license_category,
            status: values.status,
            safety_score: values.safety_score,
            complaints: values.complaints,
            notes: values.notes || null,
          })
          .eq("id", editingDriver.id);

        if (error) {
          toast.error(`Failed to update driver: ${error.message}`);
          return;
        }

        toast.success("Driver updated successfully");
      } else {
        const { error } = await supabase.from("drivers").insert({
          full_name: values.full_name,
          phone: values.phone || null,
          license_number: values.license_number,
          license_expiry: values.license_expiry,
          license_category: values.license_category,
          status: values.status,
          safety_score: values.safety_score,
          complaints: values.complaints,
          notes: values.notes || null,
        });

        if (error) {
          if (error.code === "23505") {
            toast.error("A driver with this license number already exists");
            return;
          }

          toast.error(`Failed to add driver: ${error.message}`);
          return;
        }

        toast.success(`Driver ${values.full_name} added successfully`);
      }

      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch {
      toast.error("Unexpected error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Driver" : "Register New Driver"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">

          {/* Basic info */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...form.register("full_name")} placeholder="Priya Nair" />
            <p className="text-xs text-red-500">{form.formState.errors.full_name?.message}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" {...form.register("phone")} placeholder="+91 90000 00000" />
          </div>

          {/* License */}
          <div className="space-y-2">
            <Label htmlFor="license">License Number</Label>
            <Input
              id="license"
              {...form.register("license_number")}
              placeholder="MH-01-2028-1234"
            />
            <p className="text-xs text-red-500">{form.formState.errors.license_number?.message}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiry">License Expiry</Label>
            <Input id="expiry" type="date" {...form.register("license_expiry")} />
            <p className="text-xs text-red-500">{form.formState.errors.license_expiry?.message}</p>
            {/* Live license status banner */}
            {watchedExpiry ? <LicenseBanner expiry={watchedExpiry} /> : null}
          </div>

          {/* Category + Duty Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>License Category</Label>
              <Select
                value={watchedCategory}
                onValueChange={(value) =>
                  form.setValue("license_category", value as DriverFormValues["license_category"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="Bike">Bike</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Must match the vehicle type.</p>
            </div>
            <div className="space-y-2">
              <Label>Duty Status</Label>
              <Select
                value={watchedStatus}
                onValueChange={(value) =>
                  form.setValue("status", value as DriverFormValues["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On Duty">On Duty</SelectItem>
                  <SelectItem value="Off Duty">Off Duty (Break)</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              {watchedStatus === "Suspended" ? (
                <p className="text-xs text-red-500">Suspended drivers cannot be assigned trips.</p>
              ) : null}
            </div>
          </div>

          {/* Safety Score + Complaints */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="safety" className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                Safety Score
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="safety"
                  type="number"
                  min={0}
                  max={100}
                  className="flex-1"
                  {...form.register("safety_score")}
                />
                <Badge
                  className={cn(
                    "font-semibold border shrink-0",
                    scoreColor(Number(watchedScore) || 0)
                  )}
                >
                  {Math.round(Number(watchedScore) || 0)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                0 – 100. Reflects trip history &amp; incidents.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="complaints">Complaints Filed</Label>
              <Input id="complaints" type="number" min={0} {...form.register("complaints")} />
              <p className="text-xs text-muted-foreground">Reported issues or complaints.</p>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...form.register("notes")} placeholder="Optional notes about the driver" rows={3} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
