import { CreditCard, FileSearch, ShieldAlert, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { agentRuns, customers, incidents, transactions } from "@/lib/mock-data";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(
    () => ({
      transactions: transactions.slice(0, 6),
      incidents: incidents.slice(0, 6),
      customers: customers.slice(0, 6),
      runs: agentRuns.slice(0, 6),
    }),
    [],
  );

  function go(path: string) {
    setOpen(false);
    navigate(path);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-full max-w-sm items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent/50"
      >
        <FileSearch className="size-4" />
        <span className="flex-1 text-left">Search anything...</span>
        <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search transactions, incidents, customers, runs..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Transactions">
            {results.transactions.map((t) => (
              <CommandItem key={t.id} value={t.id} onSelect={() => go(`/transactions/${t.id}`)}>
                <CreditCard />
                {t.id}
                <span className="ml-auto text-xs text-muted-foreground">{t.status}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Incidents">
            {results.incidents.map((i) => (
              <CommandItem key={i.id} value={i.id} onSelect={() => go(`/incidents/${i.id}`)}>
                <ShieldAlert />
                {i.id}
                <span className="ml-auto text-xs text-muted-foreground">{i.type}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Customers">
            {results.customers.map((c) => (
              <CommandItem key={c.id} value={`${c.id} ${c.name}`} onSelect={() => go(`/transactions?customer=${c.id}`)}>
                <User />
                {c.id}
                <span className="ml-auto text-xs text-muted-foreground">{c.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Agent Runs">
            {results.runs.map((r) => (
              <CommandItem key={r.id} value={r.id} onSelect={() => go(`/agent-runs/${r.id}`)}>
                <FileSearch />
                {r.id}
                <span className="ml-auto text-xs text-muted-foreground">{r.incidentId}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
