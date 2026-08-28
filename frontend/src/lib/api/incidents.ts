import type { Incident } from "@/types";
import { ApiError, delay } from "./utils";

const API_URL = import.meta.env.VITE_API_URL || '';

export async function getIncidents(): Promise<Incident[]> {
  try {
    const res = await fetch(`${API_URL}/api/transactions/incident`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    const json = await res.json();
    return json.data.map(mapBackendIncident).sort((a: Incident, b: Incident) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    throw new ApiError('Could not load incidents from backend');
  }
}

export async function getIncident(id: string): Promise<Incident> {
  try {
    const res = await fetch(`${API_URL}/api/transactions/incident`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    const json = await res.json();
    const found = json.data.find((t: any) => `inc_${t.id}` === id);
    if (!found) throw new ApiError(`Incident ${id} not found`);
    return mapBackendIncident(found);
  } catch (error) {
    throw new ApiError(`Incident ${id} not found`);
  }
}

export function mapBackendIncident(backendTx: any): Incident {
  let type: Incident["type"] = "Payment Failure";
  let severity: Incident["severity"] = "MEDIUM";

  if (backendTx.errorCategory === "FRAUD_SUSPECTED") {
    type = "Potential Payment Fraud";
    severity = "CRITICAL";
  } else if (backendTx.errorCategory === "NETWORK_ERROR") {
    type = "Provider Timeout";
    severity = "HIGH";
  } else {
    // INSUFFICIENT_FUNDS, EXPIRED_CARD, CARD_DECLINED, INVALID_CVV
    type = "Payment Failure";
    severity = backendTx.amount > 2000 ? "HIGH" : backendTx.amount > 500 ? "MEDIUM" : "LOW";
  }

  return {
    id: `inc_${backendTx.id}`,
    transactionId: backendTx.id,
    customerId: backendTx.userId,
    type,
    severity,
    status: "OPEN",
    aiConfidence: null,
    agentRunId: null,
    createdAt: backendTx.timestamp,
    updatedAt: backendTx.timestamp,
  };
}

export async function resolveIncident(id: string): Promise<Incident> {
  await delay(400);
  const res = await fetch(`${API_URL}/api/transactions/incident`);
  if (!res.ok) throw new ApiError(`Failed to fetch incident ${id}`);
  const json = await res.json();
  const found = json.data.find((t: any) => `inc_${t.id}` === id);
  if (!found) throw new ApiError(`Incident ${id} not found`);

  const incident = mapBackendIncident(found);
  incident.status = "RESOLVED";
  incident.updatedAt = new Date().toISOString();
  return incident;
}
