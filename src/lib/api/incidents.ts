import { agentRuns, incidents, transactions } from "@/lib/mock-data";
import { buildFindings, buildToolSteps, scenarioForIncidentType } from "@/lib/mock-data/scenarios";
import type { AgentRun, Incident, ToolExecution } from "@/types";
import { ApiError, delay } from "./utils";

export async function getIncidents(): Promise<Incident[]> {
  await delay(500);
  return [...incidents].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getIncident(id: string): Promise<Incident> {
  await delay(300);
  const found = incidents.find((i) => i.id === id);
  if (!found) throw new ApiError(`Incident ${id} not found`);
  return found;
}

export async function resolveIncident(id: string): Promise<Incident> {
  await delay(400);
  const incident = incidents.find((i) => i.id === id);
  if (!incident) throw new ApiError(`Incident ${id} not found`);
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
  const incident = incidents.find((i) => i.id === incidentId);
  if (!incident) throw new ApiError(`Incident ${incidentId} not found`);
  const transaction = transactions.find((t) => t.id === incident.transactionId);
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
