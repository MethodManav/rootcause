import { ArrowDown, ArrowUp } from "lucide-react";
import type { ComponentType } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  trendDirection = "up",
  trendTone = "neutral",
  iconTone = "default",
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  trend?: string;
  trendLabel?: string;
  trendDirection?: "up" | "down";
  trendTone?: "positive" | "negative" | "neutral";
  iconTone?: "default" | "critical" | "warning";
}) {
  return (
    <Card className="transition-colors hover:border-border/80">
      <CardContent className="flex items-start justify-between p-5">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {trend && (
            <p
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trendTone === "positive" && "text-success",
                trendTone === "negative" && "text-critical",
                trendTone === "neutral" && "text-muted-foreground",
              )}
            >
              {trendDirection === "up" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
              {trend}
              {trendLabel && <span className="text-muted-foreground">{trendLabel}</span>}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-md",
            iconTone === "default" && "bg-primary/15 text-primary",
            iconTone === "critical" && "bg-critical/15 text-critical",
            iconTone === "warning" && "bg-warning/15 text-warning",
          )}
        >
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
