import { z } from "zod"

export const vehicleSchema = z.object({
  registration_number: z.string().min(1, "Registration is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear()),
  status: z.enum(['Available', 'On Trip', 'In Shop', 'Retired']),
  mileage: z.coerce.number().min(0),
})

export const driverSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  license_number: z.string().min(1, "License number is required"),
  license_expiry: z.string().min(1, "Expiry date is required"),
  status: z.enum(['On Duty', 'Off Duty', 'Suspended']),
})

export const tripSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle is required"),
  driver_id: z.string().min(1, "Driver is required"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  cargo_weight: z.coerce.number().max(50000, "Maximum weight capacity exceeded (50,000kg)"),
  start_date: z.string().min(1, "Start date is required"),
})

export const maintenanceSchema = z.object({
  vehicle_id: z.string().min(1, "Vehicle is required"),
  service_type: z.string().min(1, "Service type is required"),
  cost: z.coerce.number().min(0),
  service_date: z.string().min(1, "Date is required"),
})

export const expenseSchema = z.object({
  trip_id: z.string().min(1, "Trip is required"),
  category: z.enum(['Fuel', 'Toll', 'Repair', 'Food', 'Other']),
  amount: z.coerce.number().min(0),
  date: z.string().min(1, "Date is required"),
})
