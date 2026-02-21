export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Retired'
export type DriverStatus = 'On Duty' | 'Off Duty' | 'Suspended'
export type TripStatus = 'Pending' | 'On Way' | 'Completed' | 'Cancelled'
export type LicenseStatus = 'Valid' | 'Expiring Soon' | 'Expired'

export interface Vehicle {
  id: string
  name: string
  license_plate: string
  model: string
  type: 'Truck' | 'Van' | 'Bike'
  max_capacity_kg: number
  odometer_km: number
  status: VehicleStatus
  region?: string | null
  acquisition_cost?: number | null
  created_at: string
}

export interface Driver {
  id: string
  full_name: string
  phone?: string | null
  license_number: string
  license_expiry: string
  license_category: 'Truck' | 'Van' | 'Bike'
  status: DriverStatus
  safety_score: number
  complaints: number
  completed_trips: number
  total_trips: number
  notes?: string | null
  created_at: string
}

export interface DriverPerformanceSummary extends Driver {
  completion_rate: number
  license_status: LicenseStatus
}

export interface Trip {
  id: string
  vehicle_id: string
  driver_id: string
  origin: string
  destination: string
  cargo_weight_kg: number
  status: TripStatus
  start_odometer_km?: number | null
  end_odometer_km?: number | null
  distance_km?: number | null
  revenue?: number | null
  estimated_fuel_cost?: number | null
  cargo_description?: string | null
  created_at: string
}

export interface TripWithRelations extends Trip {
  vehicles: Pick<Vehicle, 'id' | 'name' | 'license_plate' | 'type' | 'max_capacity_kg'> | null
  drivers: Pick<Driver, 'id' | 'full_name' | 'status' | 'license_expiry' | 'license_category' | 'safety_score'> | null
}

export interface MaintenanceLog {
  id: string
  vehicle_id: string
  service_type: string
  description?: string | null
  cost: number
  service_date: string
  mechanic?: string | null
  is_completed: boolean
}

export interface ExpenseLog {
  id: string
  vehicle_id: string
  trip_id: string
  liters: number
  total_cost: number
  misc_expense: number
  fuel_date: string
}

export interface FleetKpiSummary {
  total_active_vehicles: number
  on_trip_count: number
  in_shop_count: number
  available_count: number
  utilization_rate: number
}

export interface VehicleCostSummary {
  id: string
  name: string
  total_fuel_cost: number
  total_maintenance_cost: number
  total_revenue: number
  roi_percentage: number
}

export interface MonthlyFinancialSummaryRow {
  month_label: string
  total_revenue: number
  total_fuel_cost: number
  total_maintenance_cost: number
  net_profit: number
}

export interface VehicleFuelEfficiency {
  id: string
  name: string
  total_km: number
  total_liters: number
  km_per_liter: number
  cost_per_km: number
}
