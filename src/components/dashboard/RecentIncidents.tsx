import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { IncidentStatusBadge } from "@/components/incidents/IncidentStatusBadge";
import { SeverityBadge } from "@/components/incidents/SeverityBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState } from "@/components/ui/state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIncidents } from "@/hooks/use-incidents";
import { formatRelative } from "@/lib/format";

export function RecentIncidents() {
  const { data, isLoading, isError, refetch } = useIncidents();
  const navigate = useNavigate();
  const recent = data?.slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Incidents</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading && (
          <div className="space-y-3 p-5 pt-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        )}
        {isError && (
          <div className="px-5 pb-5">
            <ErrorState message="Unable to load incidents." onRetry={() => refetch()} />
          </div>
        )}
        {recent && recent.length === 0 && (
          <div className="px-5 pb-5">
            <EmptyState title="No incidents" description="Nothing to investigate right now." />
          </div>
        )}
        {recent && recent.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident</TableHead>
                <TableHead>Transaction</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((incident) => (
                <TableRow
                  key={incident.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                >
                  <TableCell className="font-mono text-xs font-medium text-foreground">{incident.id}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {incident.transactionId}
                  </TableCell>
                  <TableCell className="text-sm">{incident.type}</TableCell>
                  <TableCell>
                    <SeverityBadge severity={incident.severity} />
                  </TableCell>
                  <TableCell>
                    <IncidentStatusBadge status={incident.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatRelative(incident.createdAt)}
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
