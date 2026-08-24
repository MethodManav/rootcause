import { Check, ChevronDown } from "lucide-react";
import { type ReactNode, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMs, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ToolExecution } from "@/types";

export function ExecutionTrace({
  executions,
  onSelect,
  selectedId,
}: {
  executions: ToolExecution[];
  onSelect?: (execution: ToolExecution) => void;
  selectedId?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Investigation Trace</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-border p-0">
        {executions.map((execution) => (
          <TraceRow
            key={execution.id}
            execution={execution}
            isSelected={execution.id === selectedId}
            onSelect={() => onSelect?.(execution)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function TraceRow({
  execution,
  isSelected,
  onSelect,
}: {
  execution: ToolExecution;
  isSelected?: boolean;
  onSelect: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("px-5", isSelected && "bg-accent/40")}>
      <button
        className="flex w-full items-center gap-3 py-3 text-left"
        onClick={() => {
          setOpen((v) => !v);
          onSelect();
        }}
      >
        <span className="flex size-5 items-center justify-center rounded-full bg-success/15 text-success">
          <Check className="size-3" />
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium">{execution.tool}</span>
            <span className="text-xs text-muted-foreground">{formatTime(execution.timestamp)}</span>
          </div>
          <p className="text-xs text-muted-foreground">{execution.summary}</p>
        </div>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-4 pb-4 sm:grid-cols-4">
          <Field label="Duration" value={execution.durationMs !== null ? formatMs(execution.durationMs) : "—"} />
          <Field
            label="Permission"
            value={
              <Badge variant={execution.permissionDecision === "ALLOWED" ? "success" : "critical"}>
                {execution.permissionDecision}
              </Badge>
            }
          />
          <Field label="Timestamp" value={formatTime(execution.timestamp)} />
          <Field label="Status" value={execution.status} />
          <div className="col-span-2 sm:col-span-4">
            <p className="mb-1 text-xs text-muted-foreground">Input</p>
            <pre className="overflow-x-auto rounded-md border border-border bg-muted/30 p-3 text-xs">
              {JSON.stringify(execution.arguments, null, 2)}
            </pre>
          </div>
          <div className="col-span-2 sm:col-span-4">
            <p className="mb-1 text-xs text-muted-foreground">Output</p>
            <p className="rounded-md border border-border bg-muted/30 p-3 text-xs">{execution.result}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
}
