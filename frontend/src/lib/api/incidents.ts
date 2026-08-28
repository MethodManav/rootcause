import { agentRuns } from "@/lib/mock-data";
import { buildFindings, buildToolSteps, scenarioForIncidentType } from "@/lib/mock-data/scenarios";
import type { AgentRun, Incident, ToolExecution } from "@/types";
import { ApiError, delay } from "./utils";

import { mapBackendTransaction } from "./transactions";

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

export type InvestigationEvent =
  | { type: "started"; timestamp: string; runId: string }
  | { type: "tool_start"; tool: string }
  | { type: "tool_end"; execution: ToolExecution }
  | { type: "completed"; run: AgentRun };

let runCounter = 9218;

export async function startInvestigation(
  incidentId: string,
  onEvent: (event: InvestigationEvent) => void,
  signal?: AbortSignal,
): Promise<AgentRun> {
  const resInc = await fetch(`${API_URL}/api/transactions/incident`);
  const jsonInc = await resInc.json();
  const foundBackendInc = jsonInc.data.find((t: any) => `inc_${t.id}` === incidentId);
  if (!foundBackendInc) throw new ApiError(`Incident ${incidentId} not found`);
  const incident = mapBackendIncident(foundBackendInc);

  const transaction = mapBackendTransaction(foundBackendInc);
  if (!transaction) throw new ApiError(`Transaction ${incident.transactionId} not found`);

  const runId = `RUN-${runCounter++}`;
  const scenario = scenarioForIncidentType(incident.type);
  const steps = buildToolSteps({
    transactionId: transaction.id,
    customerId: incident.customerId,
    scenario,
  });

  const startedAt = new Date().toISOString();
  incident.status = "INVESTIGATING";
  incident.agentRunId = runId;
  onEvent({ type: "started", timestamp: startedAt, runId });

  // Hit the backend API route
  fetch(`${API_URL}/api/transactions/${transaction.id}/investigate`, {
    method: 'POST',
    signal
  }).then(async (response) => {
    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        console.log("Investigation API chunk:", decoder.decode(value));
      }
    }
  }).catch(err => console.error("Investigation API error:", err));

  const executions: ToolExecution[] = [];
  for (const step of steps) {
    onEvent({ type: "tool_start", tool: step.tool });
    await delay(step.durationMs, signal);
    const execution: ToolExecution = {
      id: `${runId}-exec-${executions.length + 1}`,
      tool: step.tool,
      status: "SUCCESS",
      timestamp: new Date().toISOString(),
      durationMs: step.durationMs,
      permissionDecision: "ALLOWED",
      arguments: step.arguments,
      result: step.result,
      summary: step.summary,
    };
    executions.push(execution);
    onEvent({ type: "tool_end", execution });
  }

  const scenarioConfidence: Record<string, number> = {
    insufficient_funds: 96,
    card_declined: 89,
    timeout: 90,
    duplicate: 98,
    fraud: 91,
  };
  const confidence = scenarioConfidence[scenario] ?? 90;
  const findings = buildFindings(scenario);
  const completedAt = new Date().toISOString();

  const run: AgentRun = {
    id: runId,
    incidentId,
    agentName: "Payment Investigator",
    status: "COMPLETED",
    toolExecutions: executions,
    durationMs: executions.reduce((sum, e) => sum + (e.durationMs ?? 0), 0),
    confidence,
    findings: {
      rootCause: findings.rootCause,
      confidence,
      classification: findings.classification,
      evidence: findings.evidence,
      riskSignals: findings.riskSignals,
      recommendedAction: findings.recommendedAction,
    },
    startedAt,
    completedAt,
  };

  agentRuns.unshift(run);
  incident.aiConfidence = confidence;
  incident.updatedAt = completedAt;

  onEvent({ type: "completed", run });
  return run;
}
