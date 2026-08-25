import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IncidentStatus } from "@/types";

const config: Record<IncidentStatus, { label: string; className: string }> = {
  OPEN: { label: "Open", className: "bg-muted text-muted-foreground" },
  INVESTIGATING: { label: "Investigating", className: "bg-info/15 text-info" },
  RESOLVED: { label: "Resolved", className: "bg-success/15 text-success" },
  ESCALATED: { label: "Escalated", className: "bg-critical/15 text-critical" },
};

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const { label, className } = config[status];
  return (
    <Badge className={cn("border-transparent", className)}>
      {status === "INVESTIGATING" && (
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-info opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-info" />
        </span>
      )}
      {label}
    </Badge>
  );
}
