import { Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AIFindings } from "@/types";

export function FindingsCard({ findings }: { findings: AIFindings }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0">
        <Sparkles className="size-4 text-primary" />
        <CardTitle className="text-base">AI Findings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Root Cause</p>
          <p className="text-sm leading-relaxed">{findings.rootCause}</p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Confidence</p>
            <p className="text-lg font-semibold tabular-nums">{findings.confidence}%</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Classification</p>
            <Badge variant="outline">{findings.classification}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
