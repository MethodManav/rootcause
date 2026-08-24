import { useQuery } from "@tanstack/react-query";

import { getTools } from "@/lib/api";

export function useTools() {
  return useQuery({ queryKey: ["tools"], queryFn: getTools });
}
