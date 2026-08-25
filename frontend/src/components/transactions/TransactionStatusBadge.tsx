import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TransactionStatus } from "@/types";

const config: Record<TransactionStatus, { label: string; className: string }> = {
  SUCCESS: { label: "Success", className: "bg-success/15 text-success" },
  FAILED: { label: "Failed", className: "bg-critical/15 text-critical" },
  PENDING: { label: "Pending", className: "bg-warning/15 text-warning" },
  REFUNDED: { label: "Refunded", className: "bg-muted text-muted-foreground" },
};

export function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
  const { label, className } = config[status];
  return <Badge className={cn("border-transparent", className)}>{label}</Badge>;
}
