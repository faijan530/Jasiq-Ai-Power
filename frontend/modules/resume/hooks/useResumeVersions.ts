import { useQuery } from "@tanstack/react-query";
import { getResumeVersions } from "../services/resume.api";
import type { ResumeVersionDto } from "../types/resume.dto";

export const useResumeVersions = (resumeId: string | undefined) => {
  const query = useQuery({
    queryKey: ["resume_versions", resumeId],
    enabled: !!resumeId,
    queryFn: async () => {
      const envelope = await getResumeVersions(resumeId!);
      return envelope.data as ResumeVersionDto[];
    },
  });

  return query;
};

