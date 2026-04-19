import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createResumeApi, getResume } from "../services/resume.api";
import type { CreateResumeApiResult, CreateResumeRequestDto, ResumeResponseDto } from "../types/resume.dto";

export const useResume = (resumeId: string | undefined) => {
  const query = useQuery({
    queryKey: ["resume", resumeId],
    enabled: !!resumeId,
    queryFn: async () => {
      const envelope = await getResume(resumeId!);
      return envelope.data as ResumeResponseDto;
    },
  });

  return query;
};

export const useCreateResume = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateResumeApiResult, Error, CreateResumeRequestDto>({
    mutationFn: createResumeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
};

