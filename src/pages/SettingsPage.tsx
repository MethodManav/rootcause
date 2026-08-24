import { PageContainer, PageHeader } from "@/components/layout/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ROWS = [
  { label: "Organization", value: "Sentinel Payments Ops" },
  { label: "Environment", value: "Production" },
  { label: "Default agent", value: "Payment Investigator" },
  { label: "Investigation timeout", value: "30s per tool call" },
];

export default function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader title="Settings" description="Workspace configuration and API connectivity." />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workspace</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          {ROWS.map((row) => (
            <div key={row.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className="text-sm font-medium">{row.value}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Connectivity</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            This build runs entirely on mock data. Swap the functions in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">src/lib/api</code> for real backend calls to
            connect a live payment platform.
          </p>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm">Backend connection</span>
            <Badge variant="muted">Mock data</Badge>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
