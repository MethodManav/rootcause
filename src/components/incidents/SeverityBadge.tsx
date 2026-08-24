import { AlertTriangle, ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { ComponentType } from "react";

import { Badge } from "@/components/ui/badge";
import type { IncidentSeverity } from "@/types";

const config: Record<IncidentSeverity, { label: string; variant: "critical" | "warning" | "info" | "muted"; icon: ComponentType<{ className?: string }> }> = {
  CRITICAL: { label: "Critical", variant: "critical", icon: AlertTriangle },
  HIGH: { label: "High", variant: "warning", icon: ArrowUp },
  MEDIUM: { label: "Medium", variant: "info", icon: Minus },
  LOW: { label: "Low", variant: "muted", icon: ArrowDown },
};

export function SeverityBadge({ severity }: { severity: IncidentSeverity }) {
  const { label, variant, icon: Icon } = config[severity];
  return (
    <Badge variant={variant}>
      <Icon className="size-3" />
      {label}
    </Badge>
  );
}
