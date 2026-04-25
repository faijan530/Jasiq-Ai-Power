import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { CanonicalResumeJson } from "../types/resume.dto";

const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL ? String(import.meta.env.VITE_API_BASE_URL) : "";

const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

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
      const res = await http.post("/resume/ai/generate-full-resume", payload);
      return res.data;
    },
  });
};
