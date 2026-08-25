import { useQuery } from "@tanstack/react-query";

import { getAgentRun, getAgentRuns } from "@/lib/api";

export function useAgentRuns() {
  return useQuery({ queryKey: ["agent-runs"], queryFn: getAgentRuns });
}

export function useAgentRun(id: string | undefined) {
  return useQuery({
    queryKey: ["agent-runs", id],
    queryFn: () => getAgentRun(id as string),
    enabled: Boolean(id),
  });
}
