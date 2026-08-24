import { agentRuns } from "@/lib/mock-data";
import type { AgentRun } from "@/types";
import { ApiError, delay } from "./utils";

export async function getAgentRuns(): Promise<AgentRun[]> {
  await delay(500);
  return [...agentRuns].sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

export async function getAgentRun(id: string): Promise<AgentRun> {
  await delay(350);
  const found = agentRuns.find((r) => r.id === id);
  if (!found) throw new ApiError(`Agent run ${id} not found`);
  return found;
}
