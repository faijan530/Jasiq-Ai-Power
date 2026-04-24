import axios from "axios";
import { User, UserRole } from "../store/auth.store";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
authApi.interceptors.request.use((config) => {
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

export const register = async (data: SignupRequest): Promise<AuthResponse> => {
  const response = await authApi.post<{ success: boolean; data: AuthResponse }>("/register", data);
  return response.data.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await authApi.post<{ success: boolean; data: AuthResponse }>("/login", data);
  return response.data.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await authApi.get<User>("/me");
  return response.data;
};
