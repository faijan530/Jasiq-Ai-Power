import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, UserRole } from "../store/auth.store";
import { register, login, SignupRequest, LoginRequest } from "../services/auth.api";

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, token, role, isAuthenticated, setAuth, logout } = useAuthStore();

  const redirectBasedOnRole = useCallback((userRole: UserRole) => {
    switch (userRole) {
      case "STUDENT":
        navigate("/app/resume");
        break;
      case "ADMIN":
        navigate("/admin/dashboard");
        break;
      case "PLACEMENT_OFFICER":
        navigate("/admin/dashboard");
        break;
      case "RECRUITER":
        navigate("/recruiter/dashboard");
        break;
      default:
        navigate("/app/resume");
    }
  }, [navigate]);

  const signup = useCallback(async (data: SignupRequest) => {
    try {
      const response = await register(data);
      setAuth(response);
      redirectBasedOnRole(response.user.role);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message || "Registration failed",
      };
    }
  }, [setAuth, redirectBasedOnRole]);

  const signin = useCallback(async (data: LoginRequest) => {
    try {
      const response = await login(data);
      setAuth(response);
      redirectBasedOnRole(response.user.role);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  }, [setAuth, redirectBasedOnRole]);

  const signout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const hasRole = useCallback((allowedRoles: UserRole[]) => {
    return role ? allowedRoles.includes(role) : false;
  }, [role]);

  return {
    user,
    token,
    role,
    isAuthenticated,
    signup,
    signin,
    signout,
    hasRole,
  };
};
