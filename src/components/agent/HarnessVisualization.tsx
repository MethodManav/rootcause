import { ArrowDown, Bot, CheckCircle2, KeyRound, Wrench, Workflow } from "lucide-react";
import { Fragment, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMs, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ToolExecution } from "@/types";

const FLOW_STEPS = [
  { label: "AI Agent", icon: Bot },
  { label: "Agent Harness", icon: Workflow },
  { label: "Permission Check", icon: KeyRound },
  { label: "MCP Tool", icon: Wrench },
  { label: "Tool Result", icon: CheckCircle2 },
  { label: "AI Agent", icon: Bot },
];

export function HarnessVisualization({ execution }: { execution: ToolExecution | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Agent Harness</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-1 lg:pr-6 lg:border-r lg:border-border">
          {FLOW_STEPS.map((step, i) => (
            <Fragment key={`${step.label}-${i}`}>
              <div className="flex w-40 items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-xs font-medium">
                <step.icon className="size-3.5 text-muted-foreground" />
                {step.label}
              </div>
              {i < FLOW_STEPS.length - 1 && <ArrowDown className="size-3.5 text-muted-foreground/50" />}
            </Fragment>
          ))}
        </div>

        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Tool Invocation
          </p>
          {!execution ? (
            <p className="text-sm text-muted-foreground">
              Tool invocation details will appear here once the agent starts calling MCP tools.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Field label="Tool" value={<span className="font-mono text-sm">{execution.tool}</span>} />
              <Field
                label="Status"
                value={
                  <Badge variant={execution.status === "SUCCESS" ? "success" : "info"}>
                    {execution.status}
                  </Badge>
                }
              />
              <Field
                label="Execution Time"
                value={<span className="text-sm">{execution.durationMs !== null ? formatMs(execution.durationMs) : "—"}</span>}
              />
              <Field
                label="Permission"
                value={
                  <Badge variant={execution.permissionDecision === "ALLOWED" ? "success" : "critical"}>
                    {execution.permissionDecision}
                  </Badge>
                }
              />
              <Field label="Timestamp" value={<span className="text-sm">{formatTime(execution.timestamp)}</span>} />
              <div className="col-span-2 sm:col-span-3">
                <p className="mb-1 text-xs text-muted-foreground">Arguments</p>
                <pre className="overflow-x-auto rounded-md border border-border bg-muted/30 p-3 text-xs">
                  {JSON.stringify(execution.arguments, null, 2)}
                </pre>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <p className="mb-1 text-xs text-muted-foreground">Result</p>
                <p className={cn("rounded-md border border-border bg-muted/30 p-3 text-xs")}>{execution.result}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {value}
    </div>
  );
}
