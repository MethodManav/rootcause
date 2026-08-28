import type { AgentRun, Evidence, RiskSignal, ToolExecution } from "@/types";

export type ScenarioKind = "insufficient_funds" | "fraud" | "duplicate" | "timeout" | "card_declined";

export interface ScenarioContext {
  transactionId: string;
  customerId: string;
  scenario: ScenarioKind;
}

export interface ToolStep {
  tool: string;
  durationMs: number;
  arguments: Record<string, unknown>;
  result: string;
  summary: string;
}

export function buildToolSteps(ctx: ScenarioContext): ToolStep[] {
  const steps: ToolStep[] = [
    {
      tool: "get_transaction",
      durationMs: 800,
      arguments: { transactionId: ctx.transactionId },
      result: `Transaction ${ctx.transactionId} retrieved`,
      summary: "Transaction retrieved",
    },
    {
      tool: "get_payment_details",
      durationMs: 1000,
      arguments: { transactionId: ctx.transactionId },
      result:
        ctx.scenario === "timeout"
          ? ""
          : "Provider response retrieved",
      summary: "Provider response retrieved",
    },
    {
      tool: "search_logs",
      durationMs: 1200,
      arguments: { transactionId: ctx.transactionId, window: "15m" },
      result:
        ctx.scenario === "timeout"
          ? "3 gateway timeout entries found upstream"
          : "No internal server errors found",
      summary: ctx.scenario === "timeout" ? "Gateway timeout entries found" : "No application errors detected",
    },
    {
      tool: "get_customer",
      durationMs: 700,
      arguments: { customerId: ctx.customerId },
      result: ctx.scenario === "fraud" ? "Customer account flagged for review" : "Customer account is active",
      summary: ctx.scenario === "fraud" ? "Account flagged for review" : "Customer account is active",
    },
    {
      tool: "get_customer_transaction_history",
      durationMs: 900,
      arguments: { customerId: ctx.customerId, limit: 20 },
      result:
        ctx.scenario === "fraud"
          ? "5 failed attempts within 10 minutes across 3 payment methods"
          : ctx.scenario === "duplicate"
            ? "Identical charge found 42 seconds earlier"
            : "Previous transactions retrieved",
      summary:
        ctx.scenario === "fraud"
          ? "Abnormal velocity pattern detected"
          : ctx.scenario === "duplicate"
            ? "Duplicate charge identified"
            : "Previous transactions were successful",
    },
  ];

  if (ctx.scenario === "fraud") {
    steps.push({
      tool: "flag_transaction",
      durationMs: 600,
      arguments: { transactionId: ctx.transactionId, reason: "velocity_and_ip_anomaly" },
      result: "Transaction flagged and held for fraud review",
      summary: "Transaction flagged for fraud review",
    });
  }

  steps.push({
    tool: "analyze_evidence",
    durationMs: 1500,
    arguments: { transactionId: ctx.transactionId, signals: steps.length },
    result: "Root cause identified",
    summary: "Root cause identified",
  });

  return steps;
}

export type RecommendedAction = NonNullable<AgentRun["findings"]>["recommendedAction"];

export interface ScenarioFindings {
  evidence: Evidence[];
  riskSignals?: RiskSignal[];
  rootCause: string;
  classification: string;
  recommendedAction: RecommendedAction;
}

export function buildFindings(scenario: ScenarioKind): ScenarioFindings {
  switch (scenario) {
    case "insufficient_funds":
    case "card_declined":
      return {
        rootCause:
          "Payment provider rejected the transaction because the customer's available balance was insufficient.",
        classification: "Payment Provider / Customer Issue",
        evidence: [
          { label: "Provider response code: 51", positive: true },
          { label: "Provider message indicates insufficient funds", positive: true },
          { label: "No application errors detected", positive: true },
          { label: "Customer account is active", positive: true },
          { label: "Previous transactions were successful", positive: true },
        ],
        recommendedAction: {
          title: "Do not automatically retry this transaction.",
          description: "Contact the customer and request another payment method.",
          priority: "HIGH",
        },
      };
    case "timeout":
      return {
        rootCause:
          "The payment provider failed to return a response within the configured timeout window, likely due to upstream gateway latency.",
        classification: "Provider Infrastructure Issue",
        evidence: [
          { label: "Gateway timeout after 30s", positive: true },
          { label: "3 matching timeout entries in provider logs", positive: true },
          { label: "No customer-side error detected", positive: true },
          { label: "Customer account is active", positive: true },
        ],
        recommendedAction: {
          title: "Safe to retry automatically.",
          description: "Queue an automatic retry once provider health check passes.",
          priority: "MEDIUM",
        },
      };
    case "duplicate":
      return {
        rootCause:
          "An identical charge was submitted twice within 42 seconds due to a client-side retry, resulting in a duplicate authorization.",
        classification: "Client Retry / Duplicate Submission",
        evidence: [
          { label: "Identical amount, provider, and customer within 60s", positive: true },
          { label: "Same idempotency window, different request IDs", positive: true },
          { label: "No provider-side error on either charge", positive: true },
        ],
        recommendedAction: {
          title: "Reverse the duplicate charge.",
          description: "Refund the second transaction and notify the customer automatically.",
          priority: "HIGH",
        },
      };
    case "fraud":
      return {
        rootCause:
          "Transaction pattern is consistent with card testing / account takeover: abnormal amount relative to customer baseline, high-velocity retries, and multiple originating IPs.",
        classification: "Potential Fraud",
        evidence: [
          { label: "Provider risk engine flagged transaction", positive: true },
          { label: "Customer account flagged for review", positive: true },
        ],
        riskSignals: [
          { label: "Transaction amount significantly above customer's average" },
          { label: "5 failed attempts within 10 minutes" },
          { label: "Multiple payment methods used in short window" },
          { label: "Multiple IP addresses across attempts" },
        ],
        recommendedAction: {
          title: "Block transaction and escalate to fraud operations.",
          description: "Suspend the account pending manual fraud review before allowing further charges.",
          priority: "HIGH",
        },
      };
  }
}

export function toolStepsToExecutions(
  runId: string,
  steps: ToolStep[],
  startTime: number,
): ToolExecution[] {
  let cursor = startTime;
  return steps.map((step, i) => {
    cursor += step.durationMs;
    return {
      id: `${runId}-exec-${i + 1}`,
      tool: step.tool,
      status: "SUCCESS",
      timestamp: new Date(cursor).toISOString(),
      durationMs: step.durationMs,
      permissionDecision: "ALLOWED",
      arguments: step.arguments,
      result: step.result,
      summary: step.summary,
    };
  });
}

export function scenarioForIncidentType(type: string): ScenarioKind {
  switch (type) {
    case "Suspicious Activity":
    case "Potential Payment Fraud":
      return "fraud";
    case "Duplicate Payment":
      return "duplicate";
    case "Provider Timeout":
      return "timeout";
    default:
      return "insufficient_funds";
  }
}
