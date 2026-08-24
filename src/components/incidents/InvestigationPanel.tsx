import { Bot, CheckCircle2, Loader2, Sparkles } from "lucide-react";

import { AgentTimeline } from "@/components/incidents/AgentTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InvestigationPhase, TimelineStep } from "@/hooks/use-investigation";

const CHECKLIST = [
  "Transaction details",
  "Payment provider response",
  "Application logs",
  "Customer information",
  "Transaction history",
];

export function InvestigationPanel({
  phase,
  steps,
  startedAt,
  onStart,
  disabled,
}: {
  phase: InvestigationPhase;
  steps: TimelineStep[];
  startedAt: string | null;
  onStart: () => void;
  disabled?: boolean;
}) {
  return (
    <Card className="border-primary/20">
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Bot className="size-4 text-primary" />
        <CardTitle className="text-base">AI Investigation</CardTitle>
        {phase === "running" && (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-info">
            <Loader2 className="size-3 animate-spin" />
            Running
          </span>
        )}
        {phase === "completed" && (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-success">
            <CheckCircle2 className="size-3" />
            Complete
          </span>
        )}
      </CardHeader>
      <CardContent>
        {phase === "idle" && (
          <div className="flex flex-col items-start gap-4 rounded-md border border-dashed border-border p-6">
            <p className="text-sm text-muted-foreground">
              AI Agent has not investigated this incident yet.
            </p>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">The agent will analyze:</span>
              {CHECKLIST.map((item) => (
                <span key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="size-3.5 text-muted-foreground/50" />
                  {item}
                </span>
              ))}
            </div>
            <Button onClick={onStart} disabled={disabled}>
              <Sparkles className="size-4" />
              Start Investigation
            </Button>
          </div>
        )}

        {(phase === "running" || phase === "completed") && (
          <AgentTimeline steps={steps} startedAt={startedAt} />
        )}

        {phase === "error" && (
          <p className="text-sm text-critical">
            The investigation could not complete. Please try again.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
