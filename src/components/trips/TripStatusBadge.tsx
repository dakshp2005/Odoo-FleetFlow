import { Badge } from "@/components/ui/badge"
import { TRIP_STATUS_STYLES } from "@/lib/constants"
import { cn } from "@/lib/utils/cn"

export function TripStatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn("font-normal border", TRIP_STATUS_STYLES[status])}>
      {status}
    </Badge>
  )
}
