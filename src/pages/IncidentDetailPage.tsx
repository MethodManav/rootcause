import { CheckCircle2, Sparkles } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { ExecutionTrace } from "@/components/agent/ExecutionTrace";
import { HarnessVisualization } from "@/components/agent/HarnessVisualization";
import { EvidenceList } from "@/components/incidents/EvidenceList";
import { FindingsCard } from "@/components/incidents/FindingsCard";
import { IncidentStatusBadge } from "@/components/incidents/IncidentStatusBadge";
import { IncidentSummaryCard } from "@/components/incidents/IncidentSummaryCard";
import { InvestigationPanel } from "@/components/incidents/InvestigationPanel";
import { RecommendationCard } from "@/components/incidents/RecommendationCard";
import { SeverityBadge } from "@/components/incidents/SeverityBadge";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state";
import { useAgentRun } from "@/hooks/use-agent-runs";
import { useIncident, useResolveIncident } from "@/hooks/use-incidents";
import { useInvestigation } from "@/hooks/use-investigation";
import { useTransaction } from "@/hooks/use-transactions";
import { getCustomerById } from "@/lib/mock-data";
import type { ToolExecution } from "@/types";

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: incident, isLoading, isError, refetch } = useIncident(id);
  const { data: transaction } = useTransaction(incident?.transactionId);
  const { data: existingRun } = useAgentRun(incident?.agentRunId ?? undefined);
  const investigation = useInvestigation(incident);
  const resolveIncident = useResolveIncident();
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null);

  const hasLiveRun = investigation.phase === "running" || investigation.phase === "completed";
  const executions: ToolExecution[] = useMemo(() => {
    if (hasLiveRun) return investigation.steps.map((s) => s.execution).filter((e): e is ToolExecution => e !== null);
    return existingRun?.toolExecutions ?? [];
  }, [hasLiveRun, investigation.steps, existingRun]);

  const findings = investigation.run?.findings ?? (hasLiveRun ? null : existingRun?.findings ?? null);
  const confidence = investigation.run?.confidence ?? incident?.aiConfidence ?? null;

  const selectedExecution =
    executions.find((e) => e.id === selectedExecutionId) ?? executions[executions.length - 1] ?? null;

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </PageContainer>
    );
  }

  if (isError || !incident) {
    return (
      <PageContainer>
        <ErrorState message="Unable to load this incident." onRetry={() => refetch()} />
      </PageContainer>
    );
  }

  const customer = getCustomerById(incident.customerId);
  const canInvestigate = investigation.phase === "idle" && !incident.agentRunId;
  const canResolve = incident.status !== "RESOLVED";

  return (
    <PageContainer>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{incident.id}</h1>
            <IncidentStatusBadge status={incident.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{incident.type}</p>
          <Link
            to={`/transactions/${incident.transactionId}`}
            className="mt-1 inline-block font-mono text-xs text-primary hover:underline"
          >
            Transaction: {incident.transactionId}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {canInvestigate && (
            <Button onClick={investigation.start}>
              <Sparkles className="size-4" />
              Investigate with AI
            </Button>
          )}
          <Button
            variant="outline"
            disabled={!canResolve || resolveIncident.isPending}
            onClick={() => resolveIncident.mutate(incident.id)}
          >
            <CheckCircle2 className="size-4" />
            {resolveIncident.isPending ? "Resolving..." : "Mark Resolved"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border bg-card p-4">
        <StatBlock label="Severity" value={<SeverityBadge severity={incident.severity} />} />
        <StatBlock label="Status" value={<IncidentStatusBadge status={incident.status} />} />
        <StatBlock
          label="AI Confidence"
          value={<span className="text-sm font-semibold tabular-nums">{confidence !== null ? `${confidence}%` : "—"}</span>}
        />
      </div>

      {transaction && <IncidentSummaryCard transaction={transaction} customer={customer} />}

      <InvestigationPanel
        phase={investigation.phase}
        steps={investigation.steps}
        startedAt={investigation.startedAt}
        onStart={investigation.start}
        disabled={!canInvestigate}
      />

      {executions.length > 0 && (
        <>
          <HarnessVisualization execution={selectedExecution} />
          <ExecutionTrace
            executions={executions}
            selectedId={selectedExecution?.id}
            onSelect={(e) => setSelectedExecutionId(e.id)}
          />
        </>
      )}

      {findings && (
        <>
          <FindingsCard findings={findings} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EvidenceList evidence={findings.evidence} riskSignals={findings.riskSignals} />
            <RecommendationCard action={findings.recommendedAction} />
          </div>
        </>
      )}

      <div className="pb-2">
        <Button variant="ghost" size="sm" onClick={() => navigate("/incidents")}>
          Back to incidents
        </Button>
      </div>
    </PageContainer>
  );
}

function StatBlock({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {value}
    </div>
  );
}
