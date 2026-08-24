import { ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { IncidentStatusBadge } from "@/components/incidents/IncidentStatusBadge";
import { SeverityBadge } from "@/components/incidents/SeverityBadge";
import { PageContainer } from "@/components/layout/PageContainer";
import { RiskBadge } from "@/components/transactions/RiskBadge";
import { TransactionStatusBadge } from "@/components/transactions/TransactionStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state";
import { useIncident } from "@/hooks/use-incidents";
import { useTransaction } from "@/hooks/use-transactions";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/format";
import { getCustomerById } from "@/lib/mock-data";

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: transaction, isLoading, isError, refetch } = useTransaction(id);
  const { data: incident } = useIncident(transaction?.incidentId ?? undefined);

  if (isLoading) {
    return (
      <PageContainer>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </PageContainer>
    );
  }

  if (isError || !transaction) {
    return (
      <PageContainer>
        <ErrorState message="Unable to load this transaction." onRetry={() => refetch()} />
      </PageContainer>
    );
  }

  const customer = getCustomerById(transaction.customerId);

  return (
    <PageContainer>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transaction {transaction.id}</h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-xl font-semibold tabular-nums">
            {formatCurrency(transaction.amount, transaction.currency)}
          </span>
          <TransactionStatusBadge status={transaction.status} />
          <RiskBadge risk={transaction.risk} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{formatDateTime(transaction.createdAt)}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Field label="Provider" value={transaction.provider} />
            <Field label="Payment Method" value={transaction.paymentMethod} />
            <Field label="Authorization Status" value={transaction.authorizationStatus} />
            <Field label="Provider Response" value={transaction.providerResponse} />
            <Field label="Error Code" value={transaction.errorCode ?? "—"} />
            <Field label="IP Address" value={transaction.ipAddress} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Field label="Customer ID" value={transaction.customerId} />
            <Field label="Account Status" value={customer?.accountStatus ?? "—"} />
            <Field label="Total Transactions" value={customer ? formatNumber(customer.totalTransactions) : "—"} />
            <Field label="Failed Transactions" value={customer ? formatNumber(customer.failedTransactions) : "—"} />
            <Field
              label="Average Transaction Value"
              value={customer ? formatCurrency(customer.averageTransactionValue) : "—"}
            />
          </CardContent>
        </Card>
      </div>

      {transaction.incidentId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Related Incident</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-medium">{transaction.incidentId}</span>
              {incident && (
                <>
                  <span className="text-sm text-muted-foreground">{incident.type}</span>
                  <SeverityBadge severity={incident.severity} />
                  <IncidentStatusBadge status={incident.status} />
                </>
              )}
            </div>
            <Button size="sm" onClick={() => navigate(`/incidents/${transaction.incidentId}`)}>
              View Investigation
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="pb-2">
        <Button variant="ghost" size="sm" onClick={() => navigate("/transactions")}>
          Back to transactions
        </Button>
      </div>
    </PageContainer>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
