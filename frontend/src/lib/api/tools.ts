import { tools } from "@/lib/mock-data";
import type { MCPTool } from "@/types";
import { delay } from "./utils";

export async function getTools(): Promise<MCPTool[]> {
  await delay(400);
  return tools;
}
