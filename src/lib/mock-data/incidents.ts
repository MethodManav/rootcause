import type { Incident } from "@/types";

const ts = (offsetMinutesAgo: number) =>
  new Date(new Date("2026-08-24T12:00:00Z").getTime() - offsetMinutesAgo * 60_000).toISOString();

export const incidents: Incident[] = [
  { id: "INC-1024", transactionId: "TXN-8392", customerId: "CUS-104", type: "Payment Failure", severity: "HIGH", status: "OPEN", aiConfidence: null, agentRunId: null, createdAt: ts(89), updatedAt: ts(89) },
  { id: "INC-1023", transactionId: "TXN-8391", customerId: "CUS-108", type: "Suspicious Activity", severity: "CRITICAL", status: "RESOLVED", aiConfidence: 91, agentRunId: "RUN-9217", createdAt: ts(134), updatedAt: ts(120) },
  { id: "INC-1022", transactionId: "TXN-8387", customerId: "CUS-111", type: "Provider Timeout", severity: "MEDIUM", status: "OPEN", aiConfidence: null, agentRunId: null, createdAt: ts(212), updatedAt: ts(212) },
  { id: "INC-1021", transactionId: "TXN-8382", customerId: "CUS-103", type: "Duplicate Payment", severity: "HIGH", status: "RESOLVED", aiConfidence: 98, agentRunId: "RUN-9215", createdAt: ts(340), updatedAt: ts(320) },
  { id: "INC-1020", transactionId: "TXN-8380", customerId: "CUS-113", type: "Potential Payment Fraud", severity: "HIGH", status: "ESCALATED", aiConfidence: 94, agentRunId: "RUN-9214", createdAt: ts(360), updatedAt: ts(345) },
  { id: "INC-1019", transactionId: "TXN-8374", customerId: "CUS-108", type: "Payment Failure", severity: "MEDIUM", status: "RESOLVED", aiConfidence: 88, agentRunId: "RUN-9213", createdAt: ts(140), updatedAt: ts(125) },
  { id: "INC-1018", transactionId: "TXN-8373", customerId: "CUS-108", type: "Suspicious Activity", severity: "HIGH", status: "RESOLVED", aiConfidence: 93, agentRunId: "RUN-9212", createdAt: ts(145), updatedAt: ts(130) },
  { id: "INC-1017", transactionId: "TXN-8372", customerId: "CUS-108", type: "Payment Failure", severity: "LOW", status: "RESOLVED", aiConfidence: 85, agentRunId: "RUN-9211", createdAt: ts(150), updatedAt: ts(140) },
  { id: "INC-1016", transactionId: "TXN-8365", customerId: "CUS-104", type: "Payment Failure", severity: "MEDIUM", status: "RESOLVED", aiConfidence: 96, agentRunId: "RUN-9210", createdAt: ts(600), updatedAt: ts(580) },
  { id: "INC-1015", transactionId: "TXN-8361", customerId: "CUS-107", type: "Provider Timeout", severity: "LOW", status: "RESOLVED", aiConfidence: 90, agentRunId: "RUN-9209", createdAt: ts(700), updatedAt: ts(680) },
  { id: "INC-1014", transactionId: "TXN-8354", customerId: "CUS-110", type: "Payment Failure", severity: "LOW", status: "RESOLVED", aiConfidence: 87, agentRunId: "RUN-9208", createdAt: ts(1000), updatedAt: ts(980) },
  { id: "INC-1013", transactionId: "TXN-8353", customerId: "CUS-116", type: "Payment Failure", severity: "LOW", status: "RESOLVED", aiConfidence: 84, agentRunId: "RUN-9207", createdAt: ts(1040), updatedAt: ts(1020) },
];

export function getIncidentById(id: string): Incident | undefined {
  return incidents.find((i) => i.id === id);
}

export function getIncidentsByTransactionId(transactionId: string): Incident[] {
  return incidents.filter((i) => i.transactionId === transactionId);
}
