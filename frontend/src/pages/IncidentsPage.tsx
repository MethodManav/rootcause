import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { IncidentTable } from "@/components/incidents/IncidentTable";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state";
import { useIncidents } from "@/hooks/use-incidents";
import { getCustomerById } from "@/lib/mock-data";

export default function IncidentsPage() {
  const { data, isLoading, isError, refetch } = useIncidents();
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.filter((incident) => {
      if (severity !== "all" && incident.severity !== severity) return false;
      if (status !== "all" && incident.status !== status) return false;
      if (!q) return true;
      const customer = getCustomerById(incident.customerId);
      return (
        incident.id.toLowerCase().includes(q) ||
        incident.transactionId.toLowerCase().includes(q) ||
        incident.type.toLowerCase().includes(q) ||
        customer?.name.toLowerCase().includes(q)
      );
    });
  }, [data, search, severity, status]);

  return (
    <PageContainer>
      <PageHeader title="Incidents" description="Investigate payment failures and suspicious transactions." />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="INVESTIGATING">Investigating</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="ESCALATED">Escalated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading && (
            <div className="space-y-3 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          )}
          {isError && (
            <div className="p-4">
              <ErrorState message="Unable to load incidents." onRetry={() => refetch()} />
            </div>
          )}
          {data && <IncidentTable incidents={filtered} />}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
