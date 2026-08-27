import type { Transaction, PaymentProvider, PaymentMethod } from "@/types";
import { ApiError } from "./utils";

const API_URL = import.meta.env.VITE_API_URL || '';

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const res = await fetch(`${API_URL}/api/transactions/list`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    const json = await res.json();
    
    return json.data.map(mapBackendTransaction).sort((a: Transaction, b: Transaction) => b.createdAt.localeCompare(a.createdAt));
  } catch (error) {
    throw new ApiError('Could not load transactions from backend');
  }
}

export async function getTransaction(id: string): Promise<Transaction> {
  // If we only have the list route, we can fetch all and find the one. 
  // Ideally, there should be a /api/transactions/:id route, but for now:
  try {
    const res = await fetch(`${API_URL}/api/transactions/list`);
    if (!res.ok) throw new Error('Failed to fetch transactions');
    const json = await res.json();
    const found = json.data.find((t: any) => t.id === id);
    if (!found) throw new ApiError(`Transaction ${id} not found`);
    return mapBackendTransaction(found);
  } catch (error) {
    throw new ApiError(`Transaction ${id} not found`);
  }
}

export function mapBackendTransaction(backendTx: any): Transaction {
  // Map payment method to expected frontend type
  const pmMap: Record<string, PaymentMethod> = {
    'CREDIT_CARD': 'Credit Card',
    'DEBIT_CARD': 'Debit Card',
    'UPI': 'UPI',
    'NETBANKING': 'Net Banking',
    'WALLET': 'Wallet'
  };

  return {
    id: backendTx.id,
    customerId: backendTx.userId,
    amount: backendTx.amount,
    currency: backendTx.currency,
    provider: (backendTx.gateway as PaymentProvider) || 'Razorpay',
    paymentMethod: pmMap[backendTx.paymentMethod] || 'Credit Card',
    status: backendTx.status,
    risk: backendTx.amount > 2000 ? "HIGH" : (backendTx.amount > 500 ? "ELEVATED" : "NORMAL"),
    authorizationStatus: backendTx.status === 'SUCCESS' ? 'AUTHORIZED' : (backendTx.status === 'FAILED' ? 'DECLINED' : 'PENDING'),
    providerResponse: backendTx.errorMessage || "Success",
    errorCode: backendTx.errorCategory || null,
    incidentId: backendTx.status === 'FAILED' ? `inc_${backendTx.id}` : null,
    ipAddress: "192.168.1.1",
    createdAt: backendTx.timestamp
  };
}
