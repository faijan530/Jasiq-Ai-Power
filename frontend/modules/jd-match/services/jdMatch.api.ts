import axios from 'axios';
import { EvaluateMatchRequest, MatchReport, ApiResponse, ResumeOption, ResumeVersionOption } from '../types/jdMatch.types';
import { useAuthStore } from '../../auth/store/auth.store';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth headers
api.interceptors.request.use((config) => {
  const requestId = crypto.randomUUID();
  config.headers['x-request-id'] = requestId;
  
  // Add JWT token from auth store (read directly for reliability)
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export const jdMatchApi = {
  async evaluateMatch(request: EvaluateMatchRequest): Promise<MatchReport> {
    const response = await api.post<ApiResponse<MatchReport>>('/jd-match/evaluate', request);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to evaluate match');
    }
    
    return response.data.data;
  },

  async getReportByVersionId(versionId: string): Promise<MatchReport> {
    const response = await api.get<ApiResponse<MatchReport>>(`/jd-match/report/${versionId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch report');
    }
    
    return response.data.data;
  },

  async getReportsByResumeId(resumeId: string): Promise<MatchReport[]> {
    const response = await api.get<ApiResponse<MatchReport[]>>(`/jd-match/reports/${resumeId}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch reports');
    }
    
    return response.data.data;
  },

  async getUserResumes(): Promise<ResumeOption[]> {
    const response = await api.get<ApiResponse<{ id: string; title: string }[]>>('/resume');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch resumes');
    }
    
    return response.data.data.map(r => ({ id: r.id, title: r.title }));
  },

  async getResumeVersions(resumeId: string): Promise<ResumeVersionOption[]> {
    const response = await api.get<ApiResponse<{ id: string; versionNumber: number; createdAt: string }[]>>(
      `/resume/${resumeId}/versions`
    );
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch versions');
    }
    
    return response.data.data.map(v => ({
      id: v.id,
      versionNumber: v.versionNumber,
      createdAt: v.createdAt,
    }));
  },
};

export default jdMatchApi;
