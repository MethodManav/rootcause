import { Bot, CheckCircle2, Loader2, Sparkles, AlertCircle, Wrench, ChevronDown, ChevronRight, Activity } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { InvestigationPhase } from "@/hooks/use-investigation";
import type { InvestigationEvent, InvestigationResult } from "@/types";

const CHECKLIST = [
  "Transaction details",
  "Payment provider response",
  "Application logs",
  "Customer information",
  "Transaction history",
];

export function InvestigationPanel({
  phase,
  events = [],
  result,
  errorMsg,
  onStart,
  disabled,
}: {
  phase: InvestigationPhase;
  events?: InvestigationEvent[];
  result?: InvestigationResult | null;
  errorMsg?: string | null;
  onStart: () => void;
  disabled?: boolean;
}) {
  const [showTechnical, setShowTechnical] = useState(false);

  const visibleEvents = events.filter(e => e.type !== "raw");
  const rawEvents = events.filter(e => e.type === "raw");

  return (
    <Card className="border-primary/20 shadow-md">
      <CardHeader className="flex-row items-center gap-2 space-y-0 bg-muted/20 border-b pb-4">
        <Bot className="size-5 text-primary" />
        <CardTitle className="text-lg">AI Investigation</CardTitle>
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
      <CardContent className="p-0">
        <div className="p-6">
          {phase === "idle" && (
            <div className="flex flex-col items-start gap-4 rounded-md border border-dashed border-border p-6 bg-card">
              <p className="text-sm text-muted-foreground">
                AI Agent has not investigated this incident yet.
              </p>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">The agent will analyze:</span>
                {CHECKLIST.map((item) => (
                  <span key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="size-3.5 text-muted-foreground/50" />
                    {item}
                  </span>
                ))}
              </div>
              <Button onClick={onStart} disabled={disabled} className="mt-2 w-full sm:w-auto">
                <Sparkles className="size-4 mr-2" />
                Start Investigation
              </Button>
            </div>
          )}

          {(phase === "investigating" || (phase === "completed" && events.length > 0)) && (
            <div className="space-y-6">
              {/* Investigation Timeline */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="size-4 text-muted-foreground" />
                  Investigation Steps
                </h3>
                <div className="flex flex-col gap-3 pl-2 border-l-2 border-border ml-2">
                  {visibleEvents.map((ev, i) => {
                    if (ev.type === "info") {
                      return (
                        <div key={i} className="flex items-start gap-3 relative -left-[21px]">
                          <div className="bg-background rounded-full p-1 border">
                            <CheckCircle2 className="size-3 text-muted-foreground" />
                          </div>
                          <span className="text-sm text-foreground pt-0.5">{ev.message}</span>
                        </div>
                      );
                    }
                    if (ev.type === "tool_call" || ev.type === "tool_response") {
                      return (
                        <div key={i} className="flex flex-col gap-1 relative -left-[21px]">
                          <div className="flex items-center gap-3">
                            <div className="bg-background rounded-full p-1 border">
                              <Wrench className="size-3 text-primary" />
                            </div>
                            <span className="text-sm font-medium">Tool used: {ev.toolName}</span>
                          </div>
                          {ev.type === "tool_response" && (
                            <div className="ml-7 mt-1 rounded bg-muted/40 p-3 text-xs border font-mono">
                              <div className="text-muted-foreground mb-1">Response Summary:</div>
                              <pre className="whitespace-pre-wrap font-sans text-foreground">
                                {ev.response ? (typeof ev.response === 'string' ? ev.response : JSON.stringify(ev.response, null, 2).slice(0, 150) + "...") : "Success"}
                              </pre>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  })}
                  {phase === "investigating" && (
                    <div className="flex items-center gap-3 relative -left-[21px]">
                      <div className="bg-background rounded-full p-1 border">
                        <Loader2 className="size-3 text-muted-foreground animate-spin" />
                      </div>
                      <span className="text-sm text-muted-foreground animate-pulse">Analyzing...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Final Result Card */}
              {phase === "completed" && result && (
                <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="rounded-lg border bg-card p-6 shadow-sm border-success/30 bg-success/5">
                    <h3 className="font-semibold text-lg mb-2">What happened?</h3>
                    <p className="text-sm text-foreground mb-6 leading-relaxed">
                      {result.explanation}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <span className="text-xs font-medium text-muted-foreground block mb-1">Root Cause</span>
                        <Badge variant="outline" className="font-mono bg-background">
                          {result.rootCause}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground block mb-1">Confidence</span>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          {Math.round(result.confidence * 100)}%
                        </div>
                      </div>
                    </div>

                    {result.evidence && result.evidence.length > 0 && (
                      <div className="mb-6">
                        <span className="text-xs font-medium text-muted-foreground block mb-2">Key Highlights</span>
                        <ul className="space-y-1.5">
                          {result.evidence.map((ev, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              {ev}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="rounded-md bg-background border p-4">
                      <span className="text-xs font-semibold text-primary block mb-2 uppercase tracking-wider">Recommended Action</span>
                      <p className="text-sm">{result.recommendedAction}</p>
                    </div>
                  </div>
                </div>
              )}
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
                {errorMsg && <span className="block mt-2 font-mono text-xs bg-destructive/10 p-2 rounded">{errorMsg}</span>}
              </p>
              <Button variant="outline" size="sm" onClick={onStart}>
                Try Again
              </Button>
            </div>
          )}

          {/* Technical Details Expander */}
          {(rawEvents.length > 0 || phase === "completed") && (
            <div className="mt-8 border-t pt-4">
              <button
                onClick={() => setShowTechnical(!showTechnical)}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {showTechnical ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                Advanced / Technical Details
              </button>
              
              {showTechnical && (
                <div className="mt-4 rounded bg-muted/50 p-4 border overflow-auto max-h-64">
                  <pre className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap">
                    {rawEvents.length > 0 ? (
                      rawEvents.map((e, i) => (
                        <div key={i} className="mb-2">
                          <span className="text-primary/70 block mb-0.5"># Event {i + 1}</span>
                          {JSON.stringify(e.chunk, null, 2)}
                        </div>
                      ))
                    ) : (
                      "No technical logs available."
                    )}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
