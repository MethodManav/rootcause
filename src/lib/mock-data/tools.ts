import type { MCPTool } from "@/types";

export const tools: MCPTool[] = [
  {
    id: "get_transaction",
    name: "get_transaction",
    description: "Retrieve full transaction details, including amount, provider, and status.",
    status: "AVAILABLE",
    permission: "READ",
    invocationCount: 412,
    avgExecutionMs: 180,
  },
  {
    id: "get_payment_details",
    name: "get_payment_details",
    description: "Fetch the raw payment provider response and decline/authorization codes.",
    status: "AVAILABLE",
    permission: "READ",
    invocationCount: 398,
    avgExecutionMs: 240,
  },
  {
    id: "search_logs",
    name: "search_logs",
    description: "Query application and infrastructure logs for a transaction or time window.",
    status: "AVAILABLE",
    permission: "READ",
    invocationCount: 356,
    avgExecutionMs: 410,
  },
  {
    id: "get_customer",
    name: "get_customer",
    description: "Retrieve customer profile, account status, and risk flags.",
    status: "AVAILABLE",
    permission: "READ",
    invocationCount: 401,
    avgExecutionMs: 150,
  },
  {
    id: "get_customer_transaction_history",
    name: "get_customer_transaction_history",
    description: "Retrieve the customer's recent transaction history for pattern comparison.",
    status: "AVAILABLE",
    permission: "READ",
    invocationCount: 344,
    avgExecutionMs: 320,
  },
  {
    id: "analyze_evidence",
    name: "analyze_evidence",
    description: "Correlate collected evidence and produce a root cause hypothesis with confidence score.",
    status: "AVAILABLE",
    permission: "READ",
    invocationCount: 389,
    avgExecutionMs: 1450,
  },
  {
    id: "flag_transaction",
    name: "flag_transaction",
    description: "Flag or block a transaction pending fraud review. Requires elevated permission.",
    status: "AVAILABLE",
    permission: "WRITE",
    invocationCount: 42,
    avgExecutionMs: 220,
  },
  {
    id: "create_action",
    name: "create_action",
    description: "Create a follow-up operational action item from a recommended remediation.",
    status: "AVAILABLE",
    permission: "WRITE",
    invocationCount: 87,
    avgExecutionMs: 190,
  },
];

export function getToolById(id: string): MCPTool | undefined {
  return tools.find((t) => t.id === id);
}
