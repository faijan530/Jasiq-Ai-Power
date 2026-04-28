import axios from 'axios';
import { JobResponseDto, CreateJobDto } from '../types/job.dto';
import { JobFilters } from '../types/job.filters';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const jobApiInstance = axios.create({
  baseURL: `${API_BASE_URL}/jobs`,
  headers: {
    "Content-Type": "application/json",
  },
});

jobApiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("jasiq-auth-storage");
  if (token) {
    try {
      const parsed = JSON.parse(token);
      if (parsed.state?.token) {
        config.headers.Authorization = `Bearer ${parsed.state.token}`;
      }
    } catch {
      // Ignore parsing errors
    }
  }
  return config;
});

export const jobApi = {
  getJobs: async (filters: JobFilters): Promise<JobResponseDto[]> => {
    const response = await jobApiInstance.get('/', { params: filters });
    return response.data;
  },

  getJobById: async (id: string): Promise<JobResponseDto> => {
    const response = await jobApiInstance.get(`/${id}`);
    return response.data;
  },

  searchJobs: async (filters: JobFilters): Promise<JobResponseDto[]> => {
    const response = await jobApiInstance.post('/search', filters);
    return response.data;
  },

  getTenantJobs: async (): Promise<JobResponseDto[]> => {
    const response = await jobApiInstance.get('/tenant');
    return response.data;
  },

  recommendJobs: async (resumeId: string): Promise<{ job: JobResponseDto; matchScore: number }[]> => {
    const response = await jobApiInstance.post('/recommend', { resumeId });
    return response.data;
  },

  createJob: async (data: CreateJobDto): Promise<JobResponseDto> => {
    const response = await jobApiInstance.post('/', data);
    return response.data;
  },

  updateJob: async (id: string, data: Partial<CreateJobDto>): Promise<JobResponseDto> => {
    const response = await jobApiInstance.put(`/${id}`, data);
    return response.data;
  },
};
