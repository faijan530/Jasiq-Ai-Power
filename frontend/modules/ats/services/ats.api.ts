import axios from "axios";
import {
  ATSReport,
  EvaluateATSRequest,
  ApiResponse,
} from "../types/ats.dto";
import { useAuthStore } from "../../auth/store/auth.store";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth headers
api.interceptors.request.use((config) => {
  const requestId = crypto.randomUUID();
  config.headers["x-request-id"] = requestId;

  // Add JWT token from auth store
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const atsApi = {
  async evaluateATS(request: EvaluateATSRequest): Promise<ATSReport> {
    const response = await api.post<ApiResponse<ATSReport>>(
      "/ats/evaluate",
      request
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to evaluate ATS");
    }

    return response.data.data;
  },

  async getATSReportByVersionId(versionId: string): Promise<ATSReport> {
    const response = await api.get<ApiResponse<ATSReport>>(
      `/ats/report/${versionId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch ATS report");
    }

    return response.data.data;
  },
};

export default atsApi;
