import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSeverityBreakdown } from "@/hooks/use-dashboard";
import { cn } from "@/lib/utils";

const COLORS: Record<string, string> = {
  CRITICAL: "var(--critical)",
  HIGH: "var(--warning)",
  MEDIUM: "var(--info)",
  LOW: "var(--muted-foreground)",
};

const LABELS: Record<string, string> = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export function IncidentChart() {
  const { data, isLoading, isError } = useSeverityBreakdown();
  const total = data?.reduce((sum, d) => sum + d.count, 0) ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Incident Severity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-[220px] w-full" />}
        {isError && <p className="text-sm text-muted-foreground">Unable to load severity data.</p>}
        {data && (
          <div className="flex items-center gap-6">
            <div className="relative size-[150px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="severity"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {data.map((d) => (
                      <Cell key={d.severity} fill={COLORS[d.severity]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-semibold">{total}</span>
                <span className="text-[11px] text-muted-foreground">Total</span>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2.5">
              {data.map((d) => (
                <div key={d.severity} className="flex items-center gap-2 text-sm">
                  <span
                    className={cn("size-2.5 rounded-full")}
                    style={{ background: COLORS[d.severity] }}
                  />
                  <span className="text-muted-foreground">{LABELS[d.severity]}</span>
                  <span className="ml-auto font-medium tabular-nums">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
