import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { LICENSE_STATUS_STYLES, DRIVER_STATUS_STYLES } from "@/lib/constants"
import { cn } from "@/lib/utils/cn"
import type { DriverPerformanceSummary } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Lock, ShieldCheck, ShieldAlert, Phone } from "lucide-react"

// ── helpers ───────────────────────────────────────────────────────────────────

function scoreColor(score: number) {
  if (score >= 80) return "bg-emerald-50 text-emerald-700 border-emerald-200"
  if (score >= 60) return "bg-amber-50 text-amber-700 border-amber-200"
  return "bg-red-50 text-red-700 border-red-200"
}

function getScoreIconColor(score: number) {
  if (score >= 80) return "text-emerald-600"
  if (score >= 60) return "text-amber-500"
  return "text-red-500"
}

function ScoreBadge({ value, label }: Readonly<{ value: number; label: string }>) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <Badge
        className={cn(
          "font-semibold border tabular-nums min-w-[46px] justify-center",
          scoreColor(value)
        )}
      >
        {Math.round(value)}%
      </Badge>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  )
}

// ── component ─────────────────────────────────────────────────────────────────

export function DriverTable({
  drivers,
  isLoading,
  onEdit,
  onRefresh,
}: Readonly<{
  drivers: DriverPerformanceSummary[]
  isLoading: boolean
  onEdit: (driver: DriverPerformanceSummary) => void
  onRefresh: () => void
}>) {
  const handleDelete = async (driver: DriverPerformanceSummary) => {
    if (driver.status === "On Duty") {
      toast.error("Cannot delete a driver who is currently On Duty")
      return
    }
    if (!globalThis.confirm(`Remove driver "${driver.full_name}"? This cannot be undone.`)) return

    const supabase = createClient()
    const { error } = await supabase
      .from("drivers")
      .delete()
      .eq("id", driver.id)
      .select()

    if (error) {
      if (error.code === "23503") {
        toast.error("Driver has linked trips. Suspend instead of deleting.")
      } else {
        toast.error(`Failed to delete: ${error.message}`)
      }
      return
    }

    toast.success(`Driver ${driver.full_name} removed`)
    onRefresh()
  }

  const handleStatusChange = async (
    driverId: string,
    fullName: string,
    newStatus: string
  ) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("drivers")
      .update({ status: newStatus })
      .eq("id", driverId)

    if (error) {
      toast.error(`Failed to update status: ${error.message}`)
      return
    }

    toast.success(`${fullName} is now ${newStatus}`)
    onRefresh()
  }

  // ── loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="rounded-md border p-4 space-y-3">
        {["a", "b", "c", "d"].map((k) => (
          <Skeleton key={k} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (drivers.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
        No drivers found
      </div>
    )
  }

  // ── table ──────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-10 text-center">#</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>License</TableHead>
            <TableHead>Expiry / Status</TableHead>
            <TableHead className="text-center">Trips</TableHead>
            <TableHead className="text-center">Performance</TableHead>
            <TableHead className="text-center">Complaints</TableHead>
            <TableHead>Duty Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver, idx) => {
            const isLocked = driver.license_status === "Expired"
            const isSuspended = driver.status === "Suspended"

            return (
              <TableRow
                key={driver.id}
                className={cn(
                  isLocked || isSuspended
                    ? "bg-red-50/30 hover:bg-red-50/50"
                    : undefined
                )}
              >
                {/* # */}
                <TableCell className="text-center text-muted-foreground text-xs">
                  {idx + 1}
                </TableCell>

                {/* Driver name + phone */}
                <TableCell>
                  <div className="font-medium">{driver.full_name}</div>
                  {driver.phone ? (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <Phone className="h-3 w-3" />
                      {driver.phone}
                    </div>
                  ) : null}
                </TableCell>

                {/* License # + category */}
                <TableCell>
                  <div className="font-mono text-sm">{driver.license_number}</div>
                  <Badge
                    variant="outline"
                    className="mt-1 text-[10px] px-1.5 py-0 h-4 font-normal text-muted-foreground"
                  >
                    {driver.license_category}
                  </Badge>
                </TableCell>

                {/* Expiry + license status */}
                <TableCell>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm tabular-nums">{driver.license_expiry}</span>
                    <Badge
                      className={cn(
                        "font-normal border text-xs",
                        LICENSE_STATUS_STYLES[driver.license_status] ??
                          LICENSE_STATUS_STYLES.Valid
                      )}
                    >
                      {driver.license_status}
                    </Badge>
                    {isLocked ? (
                      <Badge className="gap-1 font-semibold border bg-red-100 text-red-700 border-red-300 text-xs">
                        <Lock className="h-3 w-3" />
                        LOCKED
                      </Badge>
                    ) : null}
                  </div>
                  {isLocked ? (
                    <p className="text-[10px] text-red-500 mt-1">
                      Cannot be assigned to new trips
                    </p>
                  ) : null}
                </TableCell>

                {/* Trip count */}
                <TableCell className="text-center">
                  <div className="text-sm font-medium">
                    {driver.completed_trips}
                    <span className="text-muted-foreground font-normal">
                      /{driver.total_trips}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">completed</div>
                </TableCell>

                {/* Performance scores */}
                <TableCell>
                  <div className="flex justify-center gap-3">
                    <div className="flex items-center gap-1">
                      <ShieldCheck
                        className={cn(
                          "h-3.5 w-3.5",
                          getScoreIconColor(driver.safety_score)
                        )}
                      />
                      <ScoreBadge value={driver.safety_score} label="Safety" />
                    </div>
                    <div className="flex items-center gap-1">
                      <ScoreBadge value={driver.completion_rate} label="Complete" />
                    </div>
                  </div>
                </TableCell>

                {/* Complaints */}
                <TableCell className="text-center">
                  {driver.complaints > 0 ? (
                    <Badge className="gap-1 font-normal border bg-amber-50 text-amber-700 border-amber-200">
                      <ShieldAlert className="h-3 w-3" />
                      {driver.complaints}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>

                {/* Duty status badge + change dropdown */}
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      className={cn(
                        "font-normal border text-xs pointer-events-none",
                        DRIVER_STATUS_STYLES[driver.status] ??
                          DRIVER_STATUS_STYLES["Off Duty"]
                      )}
                    >
                      {driver.status}
                    </Badge>
                    <Select
                      value={driver.status}
                      onValueChange={(v) =>
                        void handleStatusChange(driver.id, driver.full_name, v)
                      }
                    >
                      <SelectTrigger className="w-8 h-6 px-1 border-dashed text-muted-foreground">
                        <span className="text-[10px]">▼</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="On Duty">On Duty</SelectItem>
                        <SelectItem value="Off Duty">Off Duty</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(driver)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => void handleDelete(driver)}
                    >
                      Remove
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
