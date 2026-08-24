import type { Customer } from "@/types";

export const customers: Customer[] = [
  { id: "CUS-101", name: "Ananya Rao", email: "ananya.rao@gmail.com", accountStatus: "ACTIVE", totalTransactions: 84, failedTransactions: 3, averageTransactionValue: 3420, memberSince: "2023-02-11" },
  { id: "CUS-102", name: "Rohit Sharma", email: "rohit.sharma@outlook.com", accountStatus: "ACTIVE", totalTransactions: 42, failedTransactions: 1, averageTransactionValue: 1899, memberSince: "2023-06-04" },
  { id: "CUS-103", name: "Priya Menon", email: "priya.menon@yahoo.com", accountStatus: "ACTIVE", totalTransactions: 156, failedTransactions: 6, averageTransactionValue: 5210, memberSince: "2022-09-19" },
  { id: "CUS-104", name: "Arjun Nair", email: "arjun.nair@icloud.com", accountStatus: "UNDER_REVIEW", totalTransactions: 12, failedTransactions: 5, averageTransactionValue: 41200, memberSince: "2026-06-30" },
  { id: "CUS-105", name: "Kavya Iyer", email: "kavya.iyer@gmail.com", accountStatus: "ACTIVE", totalTransactions: 63, failedTransactions: 2, averageTransactionValue: 2760, memberSince: "2023-11-27" },
  { id: "CUS-106", name: "Vikram Singh", email: "vikram.singh@proton.me", accountStatus: "ACTIVE", totalTransactions: 29, failedTransactions: 0, averageTransactionValue: 8900, memberSince: "2024-01-15" },
  { id: "CUS-107", name: "Sneha Desai", email: "sneha.desai@gmail.com", accountStatus: "ACTIVE", totalTransactions: 97, failedTransactions: 4, averageTransactionValue: 1540, memberSince: "2022-12-02" },
  { id: "CUS-108", name: "Karthik Reddy", email: "karthik.reddy@hotmail.com", accountStatus: "SUSPENDED", totalTransactions: 8, failedTransactions: 6, averageTransactionValue: 62000, memberSince: "2026-07-02" },
  { id: "CUS-109", name: "Meera Pillai", email: "meera.pillai@gmail.com", accountStatus: "ACTIVE", totalTransactions: 51, failedTransactions: 1, averageTransactionValue: 3990, memberSince: "2023-04-08" },
  { id: "CUS-110", name: "Aditya Kapoor", email: "aditya.kapoor@outlook.com", accountStatus: "ACTIVE", totalTransactions: 34, failedTransactions: 2, averageTransactionValue: 2200, memberSince: "2024-03-21" },
  { id: "CUS-111", name: "Ishita Bose", email: "ishita.bose@gmail.com", accountStatus: "ACTIVE", totalTransactions: 118, failedTransactions: 3, averageTransactionValue: 4750, memberSince: "2022-07-30" },
  { id: "CUS-112", name: "Manish Gupta", email: "manish.gupta@yahoo.com", accountStatus: "ACTIVE", totalTransactions: 19, failedTransactions: 1, averageTransactionValue: 1290, memberSince: "2024-08-14" },
  { id: "CUS-113", name: "Divya Krishnan", email: "divya.krishnan@icloud.com", accountStatus: "UNDER_REVIEW", totalTransactions: 6, failedTransactions: 4, averageTransactionValue: 28900, memberSince: "2026-08-01" },
  { id: "CUS-114", name: "Siddharth Joshi", email: "sid.joshi@gmail.com", accountStatus: "ACTIVE", totalTransactions: 73, failedTransactions: 2, averageTransactionValue: 3100, memberSince: "2023-01-09" },
  { id: "CUS-115", name: "Neha Agarwal", email: "neha.agarwal@outlook.com", accountStatus: "ACTIVE", totalTransactions: 45, failedTransactions: 0, averageTransactionValue: 6420, memberSince: "2023-10-05" },
  { id: "CUS-116", name: "Farhan Ali", email: "farhan.ali@gmail.com", accountStatus: "ACTIVE", totalTransactions: 27, failedTransactions: 1, averageTransactionValue: 1980, memberSince: "2024-05-17" },
];

export function getCustomerById(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}
