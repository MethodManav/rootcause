import { CheckCircle2, Sparkles } from "lucide-react";
import { type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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
import { useIncident, useResolveIncident } from "@/hooks/use-incidents";
import { useInvestigation } from "@/hooks/use-investigation";
import { useTransaction } from "@/hooks/use-transactions";
import { getCustomerById } from "@/lib/mock-data";

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: incident, isLoading, isError, refetch } = useIncident(id);
  const { data: transaction } = useTransaction(incident?.transactionId);
  const investigation = useInvestigation(incident);
  const resolveIncident = useResolveIncident();

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
  const canInvestigate = investigation.phase === "idle";
  const canResolve = incident.status !== "RESOLVED";

  // When we have a result, use its status, else use the incident's status
  const displayStatus = investigation.result?.status || incident.status;
  
  // Format the raw root cause string slightly
  const formatRootCause = (rc?: string) => {
    if (!rc) return "Unknown";
    return rc.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  return (
    <PageContainer>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{incident.id}</h1>
            <IncidentStatusBadge status={displayStatus as any} />
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
        <StatBlock label="Status" value={<IncidentStatusBadge status={displayStatus as any} />} />
        <StatBlock
          label="AI Confidence"
          value={
            <span className="text-sm font-semibold tabular-nums">
              {investigation.result ? `${(investigation.result.confidence * 100).toFixed(0)}%` : incident.aiConfidence ? `${incident.aiConfidence}%` : "—"}
            </span>
          }
        />
      </div>

      {transaction && <IncidentSummaryCard transaction={transaction} customer={customer} />}

      <InvestigationPanel
        phase={investigation.phase}
        errorMsg={investigation.errorMsg}
        onStart={investigation.start}
        disabled={!canInvestigate}
      />

      {investigation.result && (
        <>
          <FindingsCard findings={{
            rootCause: formatRootCause(investigation.result.rootCause),
            confidence: Math.round((investigation.result.confidence || 0) * 100),
            classification: "AI Agent Analysis",
            evidence: (investigation.result.evidence || []).map(e => ({ label: e, positive: true })),
            recommendedAction: {
              title: "Recommendation",
              description: investigation.result.recommendedAction || "No recommendation provided.",
              priority: "MEDIUM"
            }
          }} />
          
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <EvidenceList evidence={(investigation.result.evidence || []).map(e => ({ label: e, positive: true }))} />
            <RecommendationCard action={{
              title: "Recommendation",
              description: investigation.result.recommendedAction || "No recommendation provided.",
              priority: "MEDIUM"
            }} />
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-2 text-sm font-semibold">AI Explanation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {investigation.result.explanation || "No explanation provided."}
            </p>
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
