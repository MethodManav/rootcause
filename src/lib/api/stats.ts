import { incidents, transactions } from "@/lib/mock-data";
import { delay } from "./utils";

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
  await delay(450);
  const totalTransactions = 12482;
  const failedTransactions = transactions.filter((t) => t.status === "FAILED").length + 320;
  const activeIncidents = incidents.filter((i) => i.status === "OPEN" || i.status === "INVESTIGATING").length + 24;
  const criticalIncidents = incidents.filter((i) => i.severity === "CRITICAL").length + 4;

  return {
    totalTransactions,
    totalTransactionsChangePct: 8.4,
    failedTransactions,
    failedTransactionsPct: Number(((failedTransactions / totalTransactions) * 100).toFixed(1)),
    activeIncidents,
    activeIncidentsCreatedToday: 4,
    criticalIncidents,
    criticalRequiringAttention: 2,
  };
}

export interface SeverityBreakdown {
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  count: number;
}

export async function getIncidentSeverityBreakdown(): Promise<SeverityBreakdown[]> {
  await delay(400);
  return [
    { severity: "CRITICAL", count: 6 },
    { severity: "HIGH", count: 12 },
    { severity: "MEDIUM", count: 8 },
    { severity: "LOW", count: 2 },
  ];
}
