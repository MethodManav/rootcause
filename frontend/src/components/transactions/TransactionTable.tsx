import { useNavigate } from "react-router-dom";

import { RiskBadge } from "@/components/transactions/RiskBadge";
import { TransactionStatusBadge } from "@/components/transactions/TransactionStatusBadge";
import { EmptyState } from "@/components/ui/state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getCustomerById } from "@/lib/mock-data";
import type { Transaction } from "@/types";

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  const navigate = useNavigate();

  if (transactions.length === 0) {
    return (
      <EmptyState title="No transactions match your filters" description="Try adjusting the search or filter criteria." />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Transaction ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Provider</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Risk</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Incident</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((txn) => {
          const customer = getCustomerById(txn.customerId);
          return (
            <TableRow key={txn.id} className="cursor-pointer" onClick={() => navigate(`/transactions/${txn.id}`)}>
              <TableCell className="font-mono text-xs font-medium">{txn.id}</TableCell>
              <TableCell className="text-sm">{customer?.name ?? txn.customerId}</TableCell>
              <TableCell className="text-sm tabular-nums">{formatCurrency(txn.amount, txn.currency)}</TableCell>
              <TableCell className="text-sm">{txn.provider}</TableCell>
              <TableCell>
                <TransactionStatusBadge status={txn.status} />
              </TableCell>
              <TableCell>
                <RiskBadge risk={txn.risk} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{formatDateTime(txn.createdAt)}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{txn.incidentId ?? "—"}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
