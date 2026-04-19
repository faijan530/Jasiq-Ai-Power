import { useMutation } from "@tanstack/react-query";
import { renderResumePdf } from "../services/resume.api";
import type { RenderPdfResponseDto } from "../types/resume.dto";

export const useResumePdf = () => {
  const mutation = useMutation({
    mutationFn: async (resumeId: string) => {
      const envelope = await renderResumePdf(resumeId);
      return envelope.data as RenderPdfResponseDto;
    },
  });

  return mutation;
};

