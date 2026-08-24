import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionStatusBadge } from "@/components/transactions/TransactionStatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import type { Customer, Transaction } from "@/types";

export function IncidentSummaryCard({ transaction, customer }: { transaction: Transaction; customer?: Customer }) {
  const rows = [
    { label: "Transaction", value: transaction.id, mono: true },
    { label: "Amount", value: formatCurrency(transaction.amount, transaction.currency) },
    { label: "Customer", value: customer ? `${customer.name} (${customer.id})` : transaction.customerId },
    { label: "Payment Provider", value: transaction.provider },
    { label: "Status", value: <TransactionStatusBadge status={transaction.status} /> },
    { label: "Created", value: formatDateTime(transaction.createdAt) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Incident Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{row.label}</span>
            <span className={row.mono ? "font-mono text-sm font-medium" : "text-sm font-medium"}>
              {row.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
