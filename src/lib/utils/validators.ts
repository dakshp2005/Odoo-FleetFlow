import { z } from "zod"

export const vehicleSchema = z.object({
  name: z.string().min(1, "Vehicle name is required"),
  license_plate: z
    .string()
    .min(1, "License plate is required")
    .transform((val) => val.trim().toUpperCase()),
  model: z.string().min(1, "Model is required"),
  type: z.enum(['Truck', 'Van', 'Bike']),
  max_capacity_kg: z.coerce.number().gt(0, "Capacity must be greater than 0"),
  odometer_km: z.coerce.number().min(0),
  status: z.enum(['Available', 'On Trip', 'In Shop', 'Retired']).default('Available'),
  acquisition_cost: z.coerce.number().min(0).optional(),
  region: z.string().optional(),
})

export const driverSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional().or(z.literal('')),
  license_number: z.string().min(3, 'License number required'),
  license_expiry: z.string().min(1, 'Expiry date required'),
  license_category: z.enum(['Truck', 'Van', 'Bike'], {
    required_error: 'Select a vehicle category',
  }),
  status: z.enum(['On Duty', 'Off Duty', 'Suspended']).default('Off Duty'),
  safety_score: z.coerce.number().min(0).max(100).default(100),
  complaints: z.coerce.number().min(0).default(0),
  notes: z.string().optional().or(z.literal('')),
})

export const tripSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle is required"),
  driver_id: z.string().min(1, "Driver is required"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  cargo_weight_kg: z.coerce.number().gt(0, "Cargo weight is required"),
  estimated_fuel_cost: z.coerce.number().min(0).optional(),
  cargo_description: z.string().optional(),
})

export const maintenanceSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle is required"),
  service_type: z.string().min(1, "Service type is required"),
  description: z.string().optional(),
  cost: z.coerce.number().min(0),
  service_date: z.string().min(1, "Date is required"),
  mechanic: z.string().optional(),
})

export const expenseSchema = z.object({
  trip_id: z.string().min(1, "Trip is required"),
  liters: z.coerce.number().min(0),
  total_cost: z.coerce.number().min(0),
  misc_expense: z.coerce.number().min(0).default(0),
  fuel_date: z.string().min(1, "Date is required"),
})
