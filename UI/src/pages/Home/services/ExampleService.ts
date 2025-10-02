import { useSuspenseQuery } from "@tanstack/react-query";

export function useBackendResult() {
  return useSuspenseQuery({
    queryKey: ["backendResult"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5015/");
      if (!res.ok) throw new Error("Network response failed");
      return res.text();
    },
  });
}
