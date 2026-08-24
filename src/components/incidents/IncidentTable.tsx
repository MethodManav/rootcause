import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { IncidentStatusBadge } from "@/components/incidents/IncidentStatusBadge";
import { SeverityBadge } from "@/components/incidents/SeverityBadge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCustomerById } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/format";
import type { Incident } from "@/types";

export function IncidentTable({ incidents }: { incidents: Incident[] }) {
  const navigate = useNavigate();

  if (incidents.length === 0) {
    return <EmptyState title="No incidents match your filters" description="Try adjusting the search or filter criteria." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Incident ID</TableHead>
          <TableHead>Transaction</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>AI Confidence</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incidents.map((incident) => {
          const customer = getCustomerById(incident.customerId);
          return (
            <TableRow
              key={incident.id}
              className="cursor-pointer"
              onClick={() => navigate(`/incidents/${incident.id}`)}
            >
              <TableCell className="font-mono text-xs font-medium">{incident.id}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{incident.transactionId}</TableCell>
              <TableCell className="text-sm">{incident.type}</TableCell>
              <TableCell>
                <SeverityBadge severity={incident.severity} />
              </TableCell>
              <TableCell>
                <IncidentStatusBadge status={incident.status} />
              </TableCell>
              <TableCell className="text-sm">{customer?.name ?? incident.customerId}</TableCell>
              <TableCell className="text-sm tabular-nums">
                {incident.aiConfidence !== null ? `${incident.aiConfidence}%` : "—"}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{formatDateTime(incident.createdAt)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/incidents/${incident.id}`);
                  }}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
