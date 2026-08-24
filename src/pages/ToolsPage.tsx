import { ToolCard } from "@/components/agent/ToolCard";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state";
import { useTools } from "@/hooks/use-tools";

export default function ToolsPage() {
  const { data, isLoading, isError, refetch } = useTools();

  return (
    <PageContainer>
      <PageHeader title="AI Tools" description="MCP tools available to the payment investigation agent." />

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      )}
      {isError && <ErrorState message="Unable to load tools." onRetry={() => refetch()} />}
      {data && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
