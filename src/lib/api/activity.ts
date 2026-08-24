import { activity24h, activity7d, activity30d, type ActivityPoint } from "@/lib/mock-data";
import { delay } from "./utils";

export type ActivityRange = "24h" | "7d" | "30d";

export async function getTransactionActivity(range: ActivityRange): Promise<ActivityPoint[]> {
  await delay(450);
  switch (range) {
    case "24h":
      return activity24h;
    case "7d":
      return activity7d;
    case "30d":
      return activity30d;
  }
}
