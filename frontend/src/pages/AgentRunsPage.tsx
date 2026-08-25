import { AgentRunTable } from "@/components/agent/AgentRunTable";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state";
import { useAgentRuns } from "@/hooks/use-agent-runs";

export default function AgentRunsPage() {
  const { data, isLoading, isError, refetch } = useAgentRuns();

  return (
    <PageContainer>
      <PageHeader title="Agent Runs" description="Every AI investigation, with its full execution trace." />

      <Card>
        <CardContent className="p-0">
          {isLoading && (
            <div className="space-y-3 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}
          {isError && (
            <div className="p-4">
              <ErrorState message="Unable to load agent runs." onRetry={() => refetch()} />
            </div>
          )}
          {data && <AgentRunTable runs={data} />}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
