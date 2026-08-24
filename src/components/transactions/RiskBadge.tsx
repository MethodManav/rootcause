import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

const config: Record<RiskLevel, { label: string; className: string }> = {
  NORMAL: { label: "Normal", className: "bg-muted text-muted-foreground" },
  ELEVATED: { label: "Elevated", className: "bg-warning/15 text-warning" },
  HIGH: { label: "High", className: "bg-critical/15 text-critical" },
};

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const { label, className } = config[risk];
  return <Badge className={cn("border-transparent", className)}>{label}</Badge>;
}
