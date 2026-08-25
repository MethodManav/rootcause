import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getIncident, getIncidents, resolveIncident } from "@/lib/api";

export function useIncidents() {
  return useQuery({ queryKey: ["incidents"], queryFn: getIncidents });
}

export function useIncident(id: string | undefined) {
  return useQuery({
    queryKey: ["incidents", id],
    queryFn: () => getIncident(id as string),
    enabled: Boolean(id),
  });
}

export function useResolveIncident() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resolveIncident(id),
    onSuccess: (incident) => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      queryClient.setQueryData(["incidents", incident.id], incident);
    },
  });
}
