import {
  Bot,
  LayoutDashboard,
  ListTree,
  Settings,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/incidents", label: "Incidents", icon: ShieldAlert },
  { to: "/transactions", label: "Transactions", icon: ListTree },
  { to: "/agent-runs", label: "Agent Runs", icon: Bot },
  { to: "/tools", label: "AI Tools", icon: Wrench },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card/40 lg:flex">
      <div className="flex h-14 items-center gap-2 border-b border-border px-5">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <ShieldAlert className="size-4" />
        </div>
        <span className="text-sm font-semibold tracking-tight">Sentinel</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          System status: Operational
        </div>
        <div className="mt-1 flex items-center gap-2 rounded-md px-3 py-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
            OP
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium leading-tight">Ops Analyst</p>
            <p className="truncate text-xs leading-tight text-muted-foreground">ops@sentinel.dev</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
