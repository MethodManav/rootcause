import type { AgentRun } from "@/types";
import { buildFindings, buildToolSteps, toolStepsToExecutions, type ScenarioKind } from "./scenarios";

const ts = (offsetMinutesAgo: number) => new Date("2026-08-24T12:00:00Z").getTime() - offsetMinutesAgo * 60_000;

interface RunSeed {
  id: string;
  incidentId: string;
  transactionId: string;
  customerId: string;
  startOffsetMinutes: number;
  scenario: ScenarioKind;
  confidence: number;
}

function buildRun(seed: RunSeed): AgentRun {
  const startTime = ts(seed.startOffsetMinutes);
  const steps = buildToolSteps({
    transactionId: seed.transactionId,
    customerId: seed.customerId,
    scenario: seed.scenario,
  });
  const executions = toolStepsToExecutions(seed.id, steps, startTime);
  const findings = buildFindings(seed.scenario);
  const lastExec = executions[executions.length - 1];
  const totalDuration = executions.reduce((sum, e) => sum + (e.durationMs ?? 0), 0);

  return {
    id: seed.id,
    incidentId: seed.incidentId,
    agentName: "Payment Investigator",
    status: "COMPLETED",
    toolExecutions: executions,
    durationMs: totalDuration,
    confidence: seed.confidence,
    findings: {
      rootCause: findings.rootCause,
      confidence: seed.confidence,
      classification: findings.classification,
      evidence: findings.evidence,
      riskSignals: findings.riskSignals,
      recommendedAction: findings.recommendedAction,
    },
    startedAt: new Date(startTime).toISOString(),
    completedAt: lastExec.timestamp,
  };
}

const seeds: RunSeed[] = [
  { id: "RUN-9217", incidentId: "INC-1023", transactionId: "TXN-8391", customerId: "CUS-108", startOffsetMinutes: 134, scenario: "fraud", confidence: 91 },
  { id: "RUN-9215", incidentId: "INC-1021", transactionId: "TXN-8382", customerId: "CUS-103", startOffsetMinutes: 340, scenario: "duplicate", confidence: 98 },
  { id: "RUN-9214", incidentId: "INC-1020", transactionId: "TXN-8380", customerId: "CUS-113", startOffsetMinutes: 360, scenario: "fraud", confidence: 94 },
  { id: "RUN-9213", incidentId: "INC-1019", transactionId: "TXN-8374", customerId: "CUS-108", startOffsetMinutes: 140, scenario: "insufficient_funds", confidence: 88 },
  { id: "RUN-9212", incidentId: "INC-1018", transactionId: "TXN-8373", customerId: "CUS-108", startOffsetMinutes: 145, scenario: "fraud", confidence: 93 },
  { id: "RUN-9211", incidentId: "INC-1017", transactionId: "TXN-8372", customerId: "CUS-108", startOffsetMinutes: 150, scenario: "card_declined", confidence: 85 },
  { id: "RUN-9210", incidentId: "INC-1016", transactionId: "TXN-8365", customerId: "CUS-104", startOffsetMinutes: 600, scenario: "insufficient_funds", confidence: 96 },
  { id: "RUN-9209", incidentId: "INC-1015", transactionId: "TXN-8361", customerId: "CUS-107", startOffsetMinutes: 700, scenario: "timeout", confidence: 90 },
  { id: "RUN-9208", incidentId: "INC-1014", transactionId: "TXN-8354", customerId: "CUS-110", startOffsetMinutes: 1000, scenario: "card_declined", confidence: 87 },
  { id: "RUN-9207", incidentId: "INC-1013", transactionId: "TXN-8353", customerId: "CUS-116", startOffsetMinutes: 1040, scenario: "card_declined", confidence: 84 },
];

export const agentRuns: AgentRun[] = seeds.map(buildRun);

export function getAgentRunById(id: string): AgentRun | undefined {
  return agentRuns.find((r) => r.id === id);
}

export function getAgentRunByIncidentId(incidentId: string): AgentRun | undefined {
  return agentRuns.find((r) => r.incidentId === incidentId);
}
