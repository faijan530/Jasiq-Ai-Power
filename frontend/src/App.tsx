import { Suspense, useMemo, lazy } from "react";
import { Routes, Route, Navigate, Link, useLocation, Outlet } from "react-router-dom";
import { getResumeRoutes, CurrentUser } from "../modules/resume/routes";
import { getJDMatchRoutes } from "../modules/jd-match/routes";
import { getATSRoutes } from "../modules/ats/routes";
import { authRoutes } from "../modules/auth/routes";
import { useAuthStore } from "../modules/auth/store/auth.store";
import { ProtectedRoute } from "../modules/auth/components/ProtectedRoute";
import { StudentLayout } from "./layouts/StudentLayout";
import { AdminLayout } from "./layouts/AdminLayout";

// Admin pages
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminResumesPage } from "./pages/admin/AdminResumesPage";
import { AdminResumeDetailPage } from "./pages/admin/AdminResumeDetailPage";
import { AdminStudentsPage } from "./pages/admin/AdminStudentsPage";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";

// Fallback user from env for development
function currentUserFromEnv(): CurrentUser {
  const id = String(import.meta.env.VITE_USER_ID ?? "").trim();
  const tenantId = String(import.meta.env.VITE_TENANT_ID ?? "").trim();
  const emailRaw = String(import.meta.env.VITE_USER_EMAIL ?? "").trim();
  const role = String(import.meta.env.VITE_USER_ROLE ?? "STUDENT").trim() as CurrentUser["role"];
  return {
    id,
    tenantId,
    role,
    email: emailRaw || undefined,
  };
}

function Navigation() {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  
  // Don't show navigation on app routes - StudentLayout handles that
  const isAppRoute = location.pathname.startsWith("/app/");
  if (isAppRoute) return null;

  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-semibold text-slate-800">Jasiq AI</Link>
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <Link
              to="/app/resume"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Dashboard
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// Wrap route element with ProtectedRoute
const ProtectedElement = ({ element }: { element: React.ReactNode }) => (
  <ProtectedRoute>{element}</ProtectedRoute>
);

// Protected App Layout with Student Dashboard
const ProtectedAppLayout = () => (
  <ProtectedRoute>
    <StudentLayout>
      <Outlet />
    </StudentLayout>
  </ProtectedRoute>
);

// Admin-only route wrapper
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  
  if (user?.role !== "ADMIN") {
    return <Navigate to="/app/resume" replace />;
  }
  
  return <>{children}</>;
};

// Protected Admin Layout
const ProtectedAdminLayout = () => (
  <ProtectedRoute>
    <AdminRoute>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </AdminRoute>
  </ProtectedRoute>
);

export default function App() {
  const { isAuthenticated, user } = useAuthStore();
  
  // Use authenticated user if available, otherwise fallback to env
  const currentUser = useMemo(() => {
    if (isAuthenticated && user) {
      return {
        id: user.id,
        tenantId: user.tenantId || "11111111-1111-1111-1111-111111111111",
        role: user.role,
        email: user.email,
      } as CurrentUser;
    }
    return currentUserFromEnv();
  }, [isAuthenticated, user]);

  const resumeRoutes = getResumeRoutes(currentUser);
  const jdMatchRoutes = getJDMatchRoutes();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navigation />
      <Suspense fallback={<div className="p-6 text-sm text-slate-600">Loading...</div>}>
        <Routes>
          {/* Auth Routes (public) */}
          {authRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          
          {/* Protected App Routes with StudentLayout */}
          <Route element={<ProtectedAppLayout />}>
            {resumeRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            {jdMatchRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            {getATSRoutes().map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Route>
          
          {/* Protected Admin Routes */}
          <Route element={<ProtectedAdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/resumes" element={<AdminResumesPage />} />
            <Route path="/admin/resumes/:resumeId" element={<AdminResumeDetailPage />} />
            <Route path="/admin/students" element={<AdminStudentsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>
          
          {/* Default redirect */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                user?.role === "ADMIN" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/app/resume" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

