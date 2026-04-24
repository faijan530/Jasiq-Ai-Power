import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { atsApi } from "../services/ats.api";
import {
  ATSReport,
  EvaluateATSRequest,
} from "../types/ats.dto";

interface UseATSReturn {
  // Actions
  evaluateATS: (request: EvaluateATSRequest) => Promise<void>;
  fetchReport: (versionId: string) => Promise<void>;
  reset: () => void;

  // State
  loading: boolean;
  data: ATSReport | null;
  error: string | null;
  isEvaluating: boolean;
}

export function useATS(): UseATSReturn {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const evaluateMutation = useMutation({
    mutationFn: atsApi.evaluateATS,
    onSuccess: (data) => {
      // Cache the report
      queryClient.setQueryData(["ats-report", data.versionId], data);
    },
  });

  const evaluateATS = useCallback(
    async (request: EvaluateATSRequest) => {
      setError(null);
      try {
        await evaluateMutation.mutateAsync(request);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to evaluate ATS";
        setError(message);
        throw err;
      }
    },
    [evaluateMutation]
  );

  const fetchReport = useCallback(
    async (versionId: string) => {
      setError(null);
      try {
        const data = await atsApi.getATSReportByVersionId(versionId);
        queryClient.setQueryData(["ats-report", versionId], data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch report";
        setError(message);
      }
    },
    [queryClient]
  );

  const reset = useCallback(() => {
    setError(null);
    evaluateMutation.reset();
  }, [evaluateMutation]);

  return {
    evaluateATS,
    fetchReport,
    reset,
    loading: evaluateMutation.isPending,
    data: evaluateMutation.data || null,
    error,
    isEvaluating: evaluateMutation.isPending,
  };
}

export default useATS;
