import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ExecutionTrace } from "@/components/agent/ExecutionTrace";
import { HarnessVisualization } from "@/components/agent/HarnessVisualization";
import { EvidenceList } from "@/components/incidents/EvidenceList";
import { FindingsCard } from "@/components/incidents/FindingsCard";
import { RecommendationCard } from "@/components/incidents/RecommendationCard";
import { PageContainer } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state";
import { useAgentRun } from "@/hooks/use-agent-runs";
import { formatDateTime, formatMs } from "@/lib/format";

export default function AgentRunDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: run, isLoading, isError, refetch } = useAgentRun(id);
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </PageContainer>
    );
  }

  if (isError || !run) {
    return (
      <PageContainer>
        <ErrorState message="Unable to load this agent run." onRetry={() => refetch()} />
      </PageContainer>
    );
  }

  const selectedExecution =
    run.toolExecutions.find((e) => e.id === selectedExecutionId) ??
    run.toolExecutions[run.toolExecutions.length - 1] ??
    null;

  return (
    <PageContainer>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{run.id}</h1>
            <Badge variant={run.status === "COMPLETED" ? "success" : run.status === "FAILED" ? "critical" : "info"}>
              {run.status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {run.agentName} · {run.toolExecutions.length} tools · {run.durationMs !== null ? formatMs(run.durationMs) : "—"} ·
            started {formatDateTime(run.startedAt)}
          </p>
        </div>
        <Button size="sm" onClick={() => navigate(`/incidents/${run.incidentId}`)}>
          View Incident
          <ArrowRight className="size-4" />
        </Button>
      </div>

      <HarnessVisualization execution={selectedExecution} />
      <ExecutionTrace
        executions={run.toolExecutions}
        selectedId={selectedExecution?.id}
        onSelect={(e) => setSelectedExecutionId(e.id)}
      />

      {run.findings && (
        <>
          <FindingsCard findings={run.findings} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EvidenceList evidence={run.findings.evidence} riskSignals={run.findings.riskSignals} />
            <RecommendationCard action={run.findings.recommendedAction} />
          </div>
        </>
      )}

      <div className="pb-2">
        <Button variant="ghost" size="sm" onClick={() => navigate("/agent-runs")}>
          Back to agent runs
        </Button>
      </div>
    </PageContainer>
  );
}
