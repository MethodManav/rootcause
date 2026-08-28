import { useCallback, useRef, useState } from "react";
import type { Incident, InvestigationResult } from "@/types";

export type InvestigationPhase = "idle" | "investigating" | "completed" | "error";

export function useInvestigation(incident: Incident | undefined) {
  const [phase, setPhase] = useState<InvestigationPhase>("idle");
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const start = useCallback(async () => {
    if (!incident) return;
    const controller = new AbortController();
    abortRef.current = controller;
    
    setPhase("investigating");
    setResult(null);
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
      let fullText = "";

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            fullText += decoder.decode(value, { stream: !done });
          }
        }
      }

      // Try to parse JSON from the accumulated text.
      // TrueFoundry might send chunks wrapped in SSE `data: {...}` lines.
      // We will parse out the actual JSON content block.
      let jsonStr = fullText;
      // Extract the JSON object if it's inside markdown or SSE
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      
      const parsed = JSON.parse(jsonStr) as InvestigationResult;
      
      if ((parsed as any).error) {
        throw new Error((parsed as any).error);
      }
      
      setResult(parsed);
      setPhase("completed");
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

  return { phase, result, errorMsg, start, cancel };
}
