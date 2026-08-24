import { transactions } from "@/lib/mock-data";
import type { Transaction } from "@/types";
import { ApiError, delay } from "./utils";

export async function getTransactions(): Promise<Transaction[]> {
  await delay(500);
  return [...transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getTransaction(id: string): Promise<Transaction> {
  await delay(350);
  const found = transactions.find((t) => t.id === id);
  if (!found) throw new ApiError(`Transaction ${id} not found`);
  return found;
}
