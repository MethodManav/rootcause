import type { ActivityPoint } from "@/lib/mock-data";
import { ApiError } from "./utils";

const API_URL = import.meta.env.VITE_API_URL || '';

export type ActivityRange = "24h" | "7d" | "30d";

export async function getTransactionActivity(range: ActivityRange): Promise<ActivityPoint[]> {
  try {
    const res = await fetch(`${API_URL}/api/dashboard/activity?range=${range}`);
    if (!res.ok) throw new Error('Failed to fetch activity data');
    const json = await res.json();
    return json.data;
  } catch (error) {
    throw new ApiError('Could not load activity data from backend');
  }
}
