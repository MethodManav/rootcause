import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/state";
import { useTransactions } from "@/hooks/use-transactions";
import { getCustomerById } from "@/lib/mock-data";

export default function TransactionsPage() {
  const { data, isLoading, isError, refetch } = useTransactions();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("customer") ?? "");
  const [status, setStatus] = useState("all");
  const [risk, setRisk] = useState("all");

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data.filter((txn) => {
      if (status !== "all" && txn.status !== status) return false;
      if (risk !== "all" && txn.risk !== risk) return false;
      if (!q) return true;
      const customer = getCustomerById(txn.customerId);
      return (
        txn.id.toLowerCase().includes(q) ||
        txn.customerId.toLowerCase().includes(q) ||
        customer?.name.toLowerCase().includes(q) ||
        txn.provider.toLowerCase().includes(q)
      );
    });
  }, [data, search, status, risk]);

  return (
    <PageContainer>
      <PageHeader title="Transactions" description="Monitor payment transactions across all providers." />

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={risk} onValueChange={setRisk}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All risk levels</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="ELEVATED">Elevated</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
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
              <ErrorState message="Unable to load transactions." onRetry={() => refetch()} />
            </div>
          )}
          {data && <TransactionTable transactions={filtered} />}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
