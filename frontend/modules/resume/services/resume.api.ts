import axios from "axios";
import type {
  ApiEnvelope,
  CreateResumeApiResult,
  CreateResumeRequestDto,
  RenderPdfResponseDto,
  ResumeResponseDto,
  ResumeVersionDto,
  UpdateResumeRequestDto,
} from "../types/resume.dto";
import { ResumeMapper } from "./resume.mapper";
import { useAuthStore } from "../../auth/store/auth.store";

export interface AIAnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL ? String(import.meta.env.VITE_API_BASE_URL) : "";

const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token (read directly from store for reliability)
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const unwrap = async <T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<ApiEnvelope<T>> => {
  const res = await promise;
  const envelope = res.data;
  if (!envelope || envelope.success !== true || envelope.requestId === undefined) {
    throw new Error("Invalid API response envelope");
  }
  return envelope;
};

export const createResume = async (
  request: CreateResumeRequestDto,
  requestId?: string
): Promise<ApiEnvelope<ResumeResponseDto>> => {
  return unwrap<ResumeResponseDto>(
    http.post("/resume", request, requestId ? { headers: { "x-request-id": requestId } } : undefined)
  );
};

/** POST /resume — returns envelope `data` plus `resumeId` (alias of `id`) for navigation. */
export const createResumeApi = async (data: CreateResumeRequestDto): Promise<CreateResumeApiResult> => {
  const envelope = await createResume(data);
  const model = ResumeMapper.toModel(envelope.data);
  return { ...model, resumeId: model.id };
};

export const getResumes = async (requestId?: string): Promise<ApiEnvelope<ResumeResponseDto[]>> => {
  return unwrap<ResumeResponseDto[]>(
    http.get("/resume", requestId ? { headers: { "x-request-id": requestId } } : undefined)
  ).then((envelope) => ({
    ...envelope,
    data: envelope.data.map((r) => ResumeMapper.toModel(r)),
  }));
};

export const getResume = async (resumeId: string, requestId?: string): Promise<ApiEnvelope<ResumeResponseDto>> => {
  return unwrap<ResumeResponseDto>(
    http.get(`/resume/${encodeURIComponent(resumeId)}`, requestId ? { headers: { "x-request-id": requestId } } : undefined)
  ).then((envelope) => ({
    ...envelope,
    data: ResumeMapper.toModel(envelope.data),
  }));
};

export const updateResume = async (
  resumeId: string,
  request: UpdateResumeRequestDto,
  requestId?: string
): Promise<ApiEnvelope<ResumeResponseDto>> => {
  return unwrap<ResumeResponseDto>(
    http.put(
      `/resume/${encodeURIComponent(resumeId)}`,
      request,
      requestId ? { headers: { "x-request-id": requestId } } : undefined
    )
  ).then((envelope) => ({
    ...envelope,
    data: ResumeMapper.toModel(envelope.data),
  }));
};

export const getResumeVersions = async (
  resumeId: string,
  requestId?: string
): Promise<ApiEnvelope<ResumeVersionDto[]>> => {
  return unwrap<ResumeVersionDto[]>(
    http.get(
      `/resume/${encodeURIComponent(resumeId)}/versions`,
      requestId ? { headers: { "x-request-id": requestId } } : undefined
    )
  ).then((envelope) => ({
    ...envelope,
    data: envelope.data.map((v) => ResumeMapper.toVersionModel(v)),
  }));
};

export const getResumeVersion = async (
  resumeId: string,
  versionId: string,
  requestId?: string
): Promise<ApiEnvelope<ResumeVersionDto>> => {
  return unwrap<ResumeVersionDto>(
    http.get(
      `/resume/${encodeURIComponent(resumeId)}/version/${encodeURIComponent(versionId)}`,
      requestId ? { headers: { "x-request-id": requestId } } : undefined
    )
  ).then((envelope) => ({
    ...envelope,
    data: ResumeMapper.toVersionModel(envelope.data),
  }));
};

export const renderResumePdf = async (
  resumeId: string,
  requestId?: string
): Promise<ApiEnvelope<RenderPdfResponseDto>> => {
  return unwrap<RenderPdfResponseDto>(
    http.post(
      `/resume/${encodeURIComponent(resumeId)}/pdf`,
      {},
      requestId ? { headers: { "x-request-id": requestId } } : undefined
    )
  );
};

/** AI Analysis endpoint for resume analysis using Groq (score, strengths, weaknesses, suggestions) */
export const analyzeResumeWithAI = async (
  resumeId: string,
  requestId?: string
): Promise<ApiEnvelope<AIAnalysisResult>> => {
  return unwrap<AIAnalysisResult>(
    http.post(
      `/resume/${encodeURIComponent(resumeId)}/ai/analyze`,
      {},
      requestId ? { headers: { "x-request-id": requestId } } : undefined
    )
  );
};

