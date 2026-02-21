export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Retired'
export type DriverStatus = 'On Duty' | 'Off Duty' | 'Suspended'
export type TripStatus = 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled'
export type LicenseStatus = 'Valid' | 'Expiring Soon' | 'Expired'

export interface Vehicle {
  id: string
  registration_number: string
  model: string
  year: number
  status: VehicleStatus
  last_service_date?: string
  next_service_date?: string
  mileage: number
  created_at: string
}

export interface Driver {
  id: string
  full_name: string
  license_number: string
  license_expiry: string
  status: DriverStatus
  safety_score: number
  total_trips: number
  created_at: string
}

export interface Trip {
  id: string
  vehicle_id: string
  driver_id: string
  origin: string
  destination: string
  status: TripStatus
  start_date: string
  end_date?: string
  cargo_weight: number
  revenue: number
  expense_total: number
  created_at: string
}

export interface MaintenanceLog {
  id: string
  vehicle_id: string
  service_type: string
  description: string
  cost: number
  service_date: string
  status: 'Scheduled' | 'Completed' | 'Overdue'
}

export interface ExpenseLog {
  id: string
  trip_id: string
  category: 'Fuel' | 'Toll' | 'Repair' | 'Food' | 'Other'
  amount: number
  date: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

export interface AnalyticsSummary {
  roi_percentage: number
  fuel_efficiency: number
  monthly_revenue: number
  monthly_expense: number
  net_profit: number
}
