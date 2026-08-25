import { AlertOctagon, ArrowUpDown, RefreshCw, ShieldAlert, XCircle } from "lucide-react";
import { useState } from "react";

import { IncidentChart } from "@/components/dashboard/IncidentChart";
import { RecentIncidents } from "@/components/dashboard/RecentIncidents";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TransactionChart } from "@/components/dashboard/TransactionChart";
import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useOverviewStats } from "@/hooks/use-dashboard";
import { formatNumber } from "@/lib/format";

export default function DashboardPage() {
  const [range, setRange] = useState("24h");
  const { data: stats, isLoading, refetch, isFetching } = useOverviewStats();

  return (
    <PageContainer>
      <PageHeader
        title="Payment Operations"
        description="Monitor transactions and AI investigations"
        actions={
          <>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw className={isFetching ? "size-4 animate-spin" : "size-4"} />
              Refresh
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[104px] w-full" />)
        ) : (
          <>
            <StatsCard
              label="Total Transactions"
              value={formatNumber(stats.totalTransactions)}
              icon={ArrowUpDown}
              trend={`+${stats.totalTransactionsChangePct}%`}
              trendDirection="up"
              trendTone="positive"
            />
            <StatsCard
              label="Failed Transactions"
              value={formatNumber(stats.failedTransactions)}
              icon={XCircle}
              trend={`${stats.failedTransactionsPct}%`}
              trendDirection="up"
              trendTone="negative"
              iconTone="critical"
            />
            <StatsCard
              label="Active Incidents"
              value={formatNumber(stats.activeIncidents)}
              icon={ShieldAlert}
              trend={`+${stats.activeIncidentsCreatedToday} today`}
              trendDirection="up"
              trendTone="neutral"
              iconTone="warning"
            />
            <StatsCard
              label="Critical Incidents"
              value={formatNumber(stats.criticalIncidents)}
              icon={AlertOctagon}
              trend={`${stats.criticalRequiringAttention} requiring attention`}
              trendDirection="up"
              trendTone="negative"
              iconTone="critical"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <TransactionChart />
        <IncidentChart />
      </div>

      <RecentIncidents />
    </PageContainer>
  );
}
