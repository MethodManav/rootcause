import { customers } from "@/lib/mock-data";
import type { Customer } from "@/types";
import { ApiError, delay } from "./utils";

export async function getCustomers(): Promise<Customer[]> {
  await delay(400);
  return customers;
}

export async function getCustomer(id: string): Promise<Customer> {
  await delay(300);
  const found = customers.find((c) => c.id === id);
  if (!found) throw new ApiError(`Customer ${id} not found`);
  return found;
}
