import { useQuery } from "@tanstack/react-query";
import { getResumes } from "../services/resume.api";
import type { ResumeResponseDto } from "../types/resume.dto";

export const useResumes = () => {
  const query = useQuery({
    queryKey: ["resumes"],
    queryFn: async () => {
      const envelope = await getResumes();
      return envelope.data as ResumeResponseDto[];
    },
  });

  return query;
};

export default useResumes;
