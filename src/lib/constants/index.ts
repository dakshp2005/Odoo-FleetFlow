import {
  LayoutDashboard, Truck, Route,
  Wrench, Receipt, Users, BarChart3
} from 'lucide-react'

export const NAV_ITEMS = [
  { label: 'Dashboard',       href: '/dashboard',    icon: LayoutDashboard },
  { label: 'Vehicle Registry',href: '/vehicles',     icon: Truck },
  { label: 'Trip Dispatcher', href: '/trips',        icon: Route },
  { label: 'Maintenance',     href: '/maintenance',  icon: Wrench },
  { label: 'Trip & Expense',  href: '/expenses',     icon: Receipt },
  { label: 'Performance',     href: '/drivers',      icon: Users },
  { label: 'Analytics',       href: '/analytics',    icon: BarChart3 },
]

export const VEHICLE_STATUS_STYLES: Record<string, string> = {
  'Available': 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
  'On Trip':   'bg-blue-50   text-blue-700   border-blue-200   hover:bg-blue-50',
  'In Shop':   'bg-amber-50  text-amber-700  border-amber-200  hover:bg-amber-50',
  'Retired':   'bg-zinc-100  text-zinc-500   border-zinc-200   hover:bg-zinc-100',
}

export const DRIVER_STATUS_STYLES: Record<string, string> = {
  'On Duty':   'bg-blue-50  text-blue-700  border-blue-200  hover:bg-blue-50',
  'Off Duty':  'bg-zinc-100 text-zinc-500  border-zinc-200  hover:bg-zinc-100',
  'Suspended': 'bg-red-50   text-red-700   border-red-200   hover:bg-red-50',
}

export const TRIP_STATUS_STYLES: Record<string, string> = {
  'Draft':      'bg-zinc-100  text-zinc-600   border-zinc-200   hover:bg-zinc-100',
  'Dispatched': 'bg-blue-50   text-blue-700   border-blue-200   hover:bg-blue-50',
  'Completed':  'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
  'Cancelled':  'bg-red-50    text-red-600    border-red-200    hover:bg-red-50',
}

export const LICENSE_STATUS_STYLES: Record<string, string> = {
  'Valid':         'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
  'Expiring Soon': 'bg-amber-50   text-amber-700   border-amber-200   hover:bg-amber-50',
  'Expired':       'bg-red-50     text-red-700     border-red-200     hover:bg-red-50',
}
