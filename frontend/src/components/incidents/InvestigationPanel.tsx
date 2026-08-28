import { Bot, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InvestigationPhase } from "@/hooks/use-investigation";

const CHECKLIST = [
  "Transaction details",
  "Payment provider response",
  "Application logs",
  "Customer information",
  "Transaction history",
];

export function InvestigationPanel({
  phase,
  errorMsg,
  onStart,
  disabled,
}: {
  phase: InvestigationPhase;
  errorMsg?: string | null;
  onStart: () => void;
  disabled?: boolean;
}) {
  return (
    <Card className="border-primary/20">
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Bot className="size-4 text-primary" />
        <CardTitle className="text-base">AI Investigation</CardTitle>
        {phase === "investigating" && (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-medium text-info">
            <Loader2 className="size-3 animate-spin" />
            Investigating
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

        {phase === "investigating" && (
          <div className="flex flex-col items-start gap-4 rounded-md border border-dashed border-border p-6 bg-muted/30">
            <p className="text-sm font-medium">AI Agent is investigating...</p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2 animate-pulse"><Loader2 className="size-3.5 animate-spin" /> Analyzing transaction details</span>
              <span className="flex items-center gap-2 animate-pulse"><Loader2 className="size-3.5 animate-spin" /> Checking payment provider response</span>
              <span className="flex items-center gap-2 animate-pulse"><Loader2 className="size-3.5 animate-spin" /> Analyzing related incidents</span>
              <span className="flex items-center gap-2 animate-pulse"><Loader2 className="size-3.5 animate-spin" /> Reviewing application logs</span>
            </div>
          </div>
        )}

        {phase === "error" && (
          <div className="flex flex-col items-start gap-4 rounded-md border border-dashed border-destructive/50 p-6 bg-destructive/5">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="size-4" />
              <p className="text-sm font-medium">Investigation failed</p>
            </div>
            <p className="text-sm text-muted-foreground">
              We couldn't investigate this transaction right now.
              {errorMsg && <span className="block mt-1 font-mono text-xs">{errorMsg}</span>}
            </p>
            <Button variant="outline" size="sm" onClick={onStart}>
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
