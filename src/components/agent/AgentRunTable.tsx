import { useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatMs } from "@/lib/format";
import type { AgentRun } from "@/types";

export function AgentRunTable({ runs }: { runs: AgentRun[] }) {
  const navigate = useNavigate();

  if (runs.length === 0) {
    return <EmptyState title="No agent runs yet" description="Investigations will appear here once started." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Run ID</TableHead>
          <TableHead>Incident</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Tools Used</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Confidence</TableHead>
          <TableHead>Started</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {runs.map((run) => (
          <TableRow key={run.id} className="cursor-pointer" onClick={() => navigate(`/agent-runs/${run.id}`)}>
            <TableCell className="font-mono text-xs font-medium">{run.id}</TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">{run.incidentId}</TableCell>
            <TableCell className="text-sm">{run.agentName}</TableCell>
            <TableCell>
              <Badge variant={run.status === "COMPLETED" ? "success" : run.status === "FAILED" ? "critical" : "info"}>
                {run.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">{run.toolExecutions.length} tools</TableCell>
            <TableCell className="text-sm tabular-nums">{run.durationMs !== null ? formatMs(run.durationMs) : "—"}</TableCell>
            <TableCell className="text-sm tabular-nums">{run.confidence !== null ? `${run.confidence}%` : "—"}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{formatDateTime(run.startedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
