import { useQuery } from "@tanstack/react-query";

import { getTransaction, getTransactions } from "@/lib/api";

export function useTransactions() {
  return useQuery({ queryKey: ["transactions"], queryFn: getTransactions });
}

export function useTransaction(id: string | undefined) {
  return useQuery({
    queryKey: ["transactions", id],
    queryFn: () => getTransaction(id as string),
    enabled: Boolean(id),
  });
}
