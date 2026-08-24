import { useQuery } from "@tanstack/react-query";

import { getIncidentSeverityBreakdown, getOverviewStats, getTransactionActivity, type ActivityRange } from "@/lib/api";

export function useOverviewStats() {
  return useQuery({ queryKey: ["overview-stats"], queryFn: getOverviewStats });
}

export function useSeverityBreakdown() {
  return useQuery({ queryKey: ["severity-breakdown"], queryFn: getIncidentSeverityBreakdown });
}

export function useTransactionActivity(range: ActivityRange) {
  return useQuery({
    queryKey: ["transaction-activity", range],
    queryFn: () => getTransactionActivity(range),
  });
}
