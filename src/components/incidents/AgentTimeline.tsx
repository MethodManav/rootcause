import { Check, Loader2 } from "lucide-react";

import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { TimelineStep } from "@/hooks/use-investigation";

const TOOL_LABELS: Record<string, string> = {
  get_transaction: "get_transaction",
  get_payment_details: "get_payment_details",
  search_logs: "search_logs",
  get_customer: "get_customer",
  get_customer_transaction_history: "get_customer_transaction_history",
  flag_transaction: "flag_transaction",
  analyze_evidence: "analyze_evidence",
};

const RUNNING_LABELS: Record<string, string> = {
  get_transaction: "Retrieving transaction...",
  get_payment_details: "Fetching provider response...",
  search_logs: "Searching application logs...",
  get_customer: "Loading customer profile...",
  get_customer_transaction_history: "Loading transaction history...",
  flag_transaction: "Flagging transaction...",
  analyze_evidence: "Correlating evidence...",
};

export function AgentTimeline({ steps, startedAt }: { steps: TimelineStep[]; startedAt: string | null }) {
  return (
    <div className="flex flex-col">
      {startedAt && (
        <TimelineRow
          status="success"
          title="Investigation started"
          subtitle={formatTime(startedAt)}
          isFirst
        />
      )}
      {steps.map((step, i) => (
        <TimelineRow
          key={step.tool}
          status={step.status}
          title={TOOL_LABELS[step.tool] ?? step.tool}
          subtitle={
            step.status === "success"
              ? step.execution?.summary
              : step.status === "running"
                ? RUNNING_LABELS[step.tool]
                : "Waiting..."
          }
          timestamp={step.execution ? formatTime(step.execution.timestamp) : undefined}
          isLast={i === steps.length - 1}
        />
      ))}
    </div>
  );
}

function TimelineRow({
  status,
  title,
  subtitle,
  timestamp,
  isFirst,
  isLast,
}: {
  status: "waiting" | "running" | "success";
  title: string;
  subtitle?: string;
  timestamp?: string;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full",
            status === "success" && "bg-success/15 text-success",
            status === "running" && "bg-info/15 text-info",
            status === "waiting" && "border border-dashed border-border text-muted-foreground",
          )}
        >
          {status === "success" && <Check className="size-3" />}
          {status === "running" && <Loader2 className="size-3 animate-spin" />}
          {status === "waiting" && <span className="size-1.5 rounded-full bg-muted-foreground/40" />}
        </span>
        {!isLast && <span className="w-px flex-1 bg-border" />}
      </div>
      <div className={cn("flex flex-1 flex-col gap-0.5 pb-5", isFirst && "pt-0")}>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-medium",
              status === "waiting" ? "text-muted-foreground" : "font-mono text-foreground",
            )}
          >
            {title}
          </span>
          {timestamp && <span className="text-xs text-muted-foreground">{timestamp}</span>}
        </div>
        {subtitle && (
          <span className={cn("text-xs", status === "waiting" ? "text-muted-foreground/70" : "text-muted-foreground")}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
