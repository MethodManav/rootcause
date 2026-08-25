export type TransactionStatus = "SUCCESS" | "FAILED" | "PENDING" | "REFUNDED";
export type RiskLevel = "NORMAL" | "ELEVATED" | "HIGH";
export type PaymentProvider = "Stripe" | "Razorpay" | "PayPal" | "Adyen" | "PayU";
export type PaymentMethod = "Credit Card" | "Debit Card" | "UPI" | "Net Banking" | "Wallet";

export interface Customer {
  id: string;
  name: string;
  email: string;
  accountStatus: "ACTIVE" | "SUSPENDED" | "UNDER_REVIEW";
  totalTransactions: number;
  failedTransactions: number;
  averageTransactionValue: number;
  memberSince: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  risk: RiskLevel;
  authorizationStatus: "AUTHORIZED" | "DECLINED" | "PENDING" | "N/A";
  providerResponse: string;
  errorCode: string | null;
  incidentId: string | null;
  ipAddress: string;
  createdAt: string;
}

export type IncidentType =
  | "Payment Failure"
  | "Suspicious Activity"
  | "Provider Timeout"
  | "Duplicate Payment"
  | "Potential Payment Fraud";

export type IncidentSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type IncidentStatus = "OPEN" | "INVESTIGATING" | "RESOLVED" | "ESCALATED";

export interface Incident {
  id: string;
  transactionId: string;
  customerId: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  aiConfidence: number | null;
  agentRunId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ToolPermission = "READ" | "WRITE" | "ADMIN";
export type ToolStatus = "SUCCESS" | "RUNNING" | "PENDING" | "FAILED" | "WAITING";

export interface MCPTool {
  id: string;
  name: string;
  description: string;
  status: "AVAILABLE" | "UNAVAILABLE";
  permission: ToolPermission;
  invocationCount: number;
  avgExecutionMs: number;
}

export interface ToolExecution {
  id: string;
  tool: string;
  status: ToolStatus;
  timestamp: string;
  durationMs: number | null;
  permissionDecision: "ALLOWED" | "DENIED";
  arguments: Record<string, unknown>;
  result: string | null;
  summary: string;
}

export type AgentRunStatus = "RUNNING" | "COMPLETED" | "FAILED";

export interface Evidence {
  label: string;
  positive: boolean;
}

export interface RiskSignal {
  label: string;
}

export interface AIFindings {
  rootCause: string;
  confidence: number;
  classification: string;
  evidence: Evidence[];
  riskSignals?: RiskSignal[];
  recommendedAction: {
    title: string;
    description: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
  };
}

export interface AgentRun {
  id: string;
  incidentId: string;
  agentName: string;
  status: AgentRunStatus;
  toolExecutions: ToolExecution[];
  durationMs: number | null;
  confidence: number | null;
  findings: AIFindings | null;
  startedAt: string;
  completedAt: string | null;
}
