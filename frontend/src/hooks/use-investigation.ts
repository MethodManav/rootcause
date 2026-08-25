import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";

import { startInvestigation, type InvestigationEvent } from "@/lib/api";
import { buildToolSteps, scenarioForIncidentType } from "@/lib/mock-data/scenarios";
import type { AgentRun, Incident, ToolExecution } from "@/types";

export type TimelineStepStatus = "waiting" | "running" | "success";

export interface TimelineStep {
  tool: string;
  status: TimelineStepStatus;
  execution: ToolExecution | null;
}

export type InvestigationPhase = "idle" | "running" | "completed" | "error";

export function useInvestigation(incident: Incident | undefined) {
  const queryClient = useQueryClient();
  const [phase, setPhase] = useState<InvestigationPhase>("idle");
  const [steps, setSteps] = useState<TimelineStep[]>([]);
  const [run, setRun] = useState<AgentRun | null>(null);
  const [startedAt, setStartedAt] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const plannedTools = useMemo(() => {
    if (!incident) return [];
    const scenario = scenarioForIncidentType(incident.type);
    return buildToolSteps({
      transactionId: incident.transactionId,
      customerId: incident.customerId,
      scenario,
    }).map((s) => s.tool);
  }, [incident]);

  const start = useCallback(() => {
    if (!incident) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setPhase("running");
    setRun(null);
    setSteps(plannedTools.map((tool) => ({ tool, status: "waiting", execution: null })));

    function onEvent(event: InvestigationEvent) {
      if (event.type === "started") {
        setStartedAt(event.timestamp);
      } else if (event.type === "tool_start") {
        setSteps((prev) =>
          prev.map((s) => (s.tool === event.tool && s.status === "waiting" ? { ...s, status: "running" } : s)),
        );
      } else if (event.type === "tool_end") {
        setSteps((prev) =>
          prev.map((s) =>
            s.tool === event.execution.tool && s.status !== "success"
              ? { ...s, status: "success", execution: event.execution }
              : s,
          ),
        );
      } else if (event.type === "completed") {
        setRun(event.run);
        setPhase("completed");
        queryClient.invalidateQueries({ queryKey: ["agent-runs"] });
        queryClient.invalidateQueries({ queryKey: ["incidents"] });
      }
    }

    startInvestigation(incident.id, onEvent, controller.signal).catch((err) => {
      if (err?.name !== "AbortError") setPhase("error");
    });
  }, [incident, plannedTools, queryClient]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { phase, steps, run, startedAt, start, cancel, plannedTools };
}
