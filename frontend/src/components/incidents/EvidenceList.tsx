import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Evidence, RiskSignal } from "@/types";

export function EvidenceList({ evidence, riskSignals }: { evidence: Evidence[]; riskSignals?: RiskSignal[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{riskSignals?.length ? "Evidence & Risk Signals" : "Evidence"}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {evidence.map((item) => (
          <div key={item.label} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
            {item.label}
          </div>
        ))}
        {riskSignals?.map((item) => (
          <div key={item.label} className="flex items-start gap-2 text-sm">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
            {item.label}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
