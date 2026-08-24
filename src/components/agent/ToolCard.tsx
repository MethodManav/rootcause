import { Terminal } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatMs, formatNumber } from "@/lib/format";
import type { MCPTool } from "@/types";

export function ToolCard({ tool }: { tool: MCPTool }) {
  return (
    <Card className="transition-colors hover:border-border/80">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Terminal className="size-4" />
          </div>
          <span className="font-mono text-sm font-semibold">{tool.name}</span>
        </div>
        <Badge variant={tool.status === "AVAILABLE" ? "success" : "muted"}>
          {tool.status === "AVAILABLE" ? "Available" : "Unavailable"}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{tool.description}</p>
        <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
          <Field label="Permission" value={<Badge variant={tool.permission === "READ" ? "info" : "warning"}>{tool.permission}</Badge>} />
          <Field label="Invocations" value={formatNumber(tool.invocationCount)} />
          <Field label="Avg. Time" value={formatMs(tool.avgExecutionMs)} />
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
