import { Bell } from "lucide-react";

import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background/80 px-5 backdrop-blur">
      <div className="flex-1">
        <GlobalSearch />
      </div>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="size-4" />
        <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-critical" />
      </Button>
      <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
        OP
      </div>
    </header>
  );
}
