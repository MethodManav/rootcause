import { ApiError } from "./utils";

export interface OverviewStats {
  totalTransactions: number;
  totalTransactionsChangePct: number;
  failedTransactions: number;
  failedTransactionsPct: number;
  activeIncidents: number;
  activeIncidentsCreatedToday: number;
  criticalIncidents: number;
  criticalRequiringAttention: number;
}

export async function getOverviewStats(): Promise<OverviewStats> {
  try {
    const res = await fetch('/api/dashboard/stats');
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    const json = await res.json();
    return json.data;
  } catch (error) {
    throw new ApiError('Could not load dashboard stats from backend');
  }
}

export interface SeverityBreakdown {
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  count: number;
}

export async function getIncidentSeverityBreakdown(): Promise<SeverityBreakdown[]> {
  try {
    const res = await fetch('/api/dashboard/severity');
    if (!res.ok) throw new Error('Failed to fetch severity breakdown');
    const json = await res.json();
    return json.data;
  } catch (error) {
    throw new ApiError('Could not load severity breakdown from backend');
  }
}
