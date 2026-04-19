import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { CanonicalResumeJson } from "../types/resume.dto";

interface GenerateFullResumePayload {
  name: string;
  role: string;
  skills?: string[];
  experience?: string;
  education?: string;
}

interface GenerateFullResumeResponse {
  data: CanonicalResumeJson;
}

export const useAiResumeBuilder = () => {
  return useMutation<GenerateFullResumeResponse, Error, GenerateFullResumePayload>({
    mutationFn: async (payload: GenerateFullResumePayload) => {
      const res = await axios.post("/resume/ai/generate-full-resume", payload);
      return res.data;
    },
  });
};
