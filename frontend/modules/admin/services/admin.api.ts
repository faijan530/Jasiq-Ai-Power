import axios from "axios";
import { useAuthStore } from "../../auth/store/auth.store";

export interface AdminResumeItem {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  latestVersion: {
    id: string;
    versionNumber: number;
    resumeJson: any;
    createdAt: string;
  } | null;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL ? String(import.meta.env.VITE_API_BASE_URL) : "";

const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  requestId?: string;
  message?: string;
}

const unwrap = async <T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<ApiEnvelope<T>> => {
  const res = await promise;
  const envelope = res.data;
  if (!envelope || envelope.success !== true) {
    throw new Error(envelope?.message || "Invalid API response envelope");
  }
  return envelope;
};

export const getAllResumesForAdmin = async (): Promise<ApiEnvelope<AdminResumeItem[]>> => {
  return unwrap<AdminResumeItem[]>(http.get("/resume/admin/all"));
};

export const getResumeVersions = async (resumeId: string): Promise<ApiEnvelope<any[]>> => {
  return unwrap<any[]>(http.get(`/resume/${encodeURIComponent(resumeId)}/versions`));
};

export const getResumePdf = async (resumeId: string): Promise<ApiEnvelope<{ html: string; pdfUrl: string }>> => {
  return unwrap<{ html: string; pdfUrl: string }>(
    http.post(`/resume/${encodeURIComponent(resumeId)}/pdf`, {})
  );
};

// Admin User Management APIs
export const getAllAdmins = async (): Promise<ApiEnvelope<AdminUser[]>> => {
  return unwrap<AdminUser[]>(http.get("/auth/admins"));
};

export interface CreateAdminRequest {
  email: string;
  password: string;
  name: string;
  tenantId?: string;
}

export const createAdmin = async (data: CreateAdminRequest): Promise<ApiEnvelope<{ id: string; email: string; name: string }>> => {
  return unwrap<{ id: string; email: string; name: string }>(http.post("/auth/create-admin", data));
};
