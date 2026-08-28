import { useCallback, useRef, useState } from "react";
import type { Incident, InvestigationResult, InvestigationEvent } from "@/types";

export type InvestigationPhase = "idle" | "investigating" | "completed" | "error";

export function useInvestigation(incident: Incident | undefined) {
  const [phase, setPhase] = useState<InvestigationPhase>("idle");
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [events, setEvents] = useState<InvestigationEvent[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(async () => {
    if (!incident) return;
    const controller = new AbortController();
    abortRef.current = controller;
    
    setPhase("investigating");
    setResult(null);
    setEvents([{ type: "info", message: "Investigation started" }]);
    setErrorMsg(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_URL}/api/transactions/${incident.transactionId}/investigate`, {
        method: "POST",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Read SSE stream
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      if (reader) {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || ""; // Keep the last incomplete chunk in buffer

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6);
              if (dataStr.trim() === "[DONE]") {
                continue;
              }
              
              try {
                const chunk = JSON.parse(dataStr);
                
                // Add raw event for debugging
                setEvents(prev => [...prev, { type: "raw", chunk }]);

                // Check for fallback raw response
                if (chunk.rootCause && chunk.transactionId) {
                  setResult(chunk as InvestigationResult);
                  setPhase("completed");
                  continue;
                }

                // Check TrueFoundry completion event
                if (chunk.type === "turn.done") {
                  if (chunk.state?.output?.content) {
                    try {
                      const parsed = JSON.parse(chunk.state.output.content) as InvestigationResult;
                      if ((parsed as any).error) {
                        throw new Error((parsed as any).error);
                      }
                      setResult(parsed);
                      setPhase("completed");
                    } catch (e) {
                      console.error("Failed to parse turn.done output", e);
                    }
                  }
                }

                // Tool calls
                const isToolCall = chunk.type === "model.tool_call" || chunk.type === "tool_call" || chunk.type === "tool.execution";
                if (isToolCall) {
                  const toolName = chunk.tool?.name || chunk.name || chunk.toolName || "Unknown Tool";
                  setEvents(prev => [...prev, { type: "tool_call", toolName, args: chunk.args || chunk.arguments || chunk.input }]);
                }
                
                const isToolResponse = chunk.type === "model.tool_response" || chunk.type === "tool_response" || chunk.type === "tool.response";
                if (isToolResponse) {
                  const toolName = chunk.tool?.name || chunk.name || chunk.toolName || "Unknown Tool";
                  setEvents(prev => [...prev, { type: "tool_response", toolName, response: chunk.response || chunk.output || chunk.result }]);
                }
              } catch (e) {
                console.error("Failed to parse SSE line", e);
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setPhase("error");
        setErrorMsg(err.message || "An unknown error occurred.");
      }
    }
  }, [incident]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { phase, result, events, errorMsg, start, cancel };
}
