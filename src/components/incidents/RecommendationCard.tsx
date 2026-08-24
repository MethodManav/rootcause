import { ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AIFindings } from "@/types";

export function RecommendationCard({ action }: { action: AIFindings["recommendedAction"] }) {
  const [decision, setDecision] = useState<"pending" | "created" | "dismissed">("pending");

  return (
    <Card className="border-primary/20 bg-primary/[0.03]">
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <ShieldCheck className="size-4 text-primary" />
        <CardTitle className="text-base">Recommended Action</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <p className="text-sm font-medium">{action.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Priority:</span>
          <Badge
            variant={action.priority === "HIGH" ? "critical" : action.priority === "MEDIUM" ? "warning" : "muted"}
          >
            {action.priority}
          </Badge>
        </div>
        <div className={cn("flex gap-2", decision !== "pending" && "opacity-60")}>
          <Button size="sm" disabled={decision !== "pending"} onClick={() => setDecision("created")}>
            {decision === "created" ? "Action Created" : "Create Action"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={decision !== "pending"}
            onClick={() => setDecision("dismissed")}
          >
            {decision === "dismissed" ? "Dismissed" : "Dismiss"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
