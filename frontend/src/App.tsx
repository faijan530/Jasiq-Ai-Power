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

// Job Engine pages
import { JobFeedPage } from "../modules/job-engine/pages/JobFeedPage";
import { JobDetailPage } from "../modules/job-engine/pages/JobDetailPage";
import { JobSearchPage } from "../modules/job-engine/pages/JobSearchPage";
import { JobRecommendationsPage } from "../modules/job-engine/pages/JobRecommendationsPage";
import { JobAdminListPage } from "../modules/job-engine/pages/JobAdminListPage";
import { JobAdminCreatePage } from "../modules/job-engine/pages/JobAdminCreatePage";
import { JobAdminEditPage } from "../modules/job-engine/pages/JobAdminEditPage";

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
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-bold text-2xl tracking-tight text-[#0a66c2]">
          JASIQ <span className="text-sm font-normal text-gray-500">AI</span>
        </Link>
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 text-sm font-semibold text-[#0a66c2] hover:bg-[#e8f3ff] border border-[#0a66c2] rounded-full transition-colors"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <Link
              to="/app/resume"
              className="px-5 py-2 text-sm font-semibold text-white bg-[#0a66c2] hover:bg-[#004182] rounded-full transition-colors shadow-sm"
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
    <div className="min-h-screen bg-[#F3F2EF] text-gray-900">
      <Navigation />
      <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading...</div>}>
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
            {/* Job Engine Routes */}
            <Route path="/app/jobs" element={<JobFeedPage />} />
            <Route path="/app/jobs/:jobId" element={<JobDetailPage />} />
            <Route path="/app/jobs/search" element={<JobSearchPage />} />
            <Route path="/app/jobs/recommendations" element={<JobRecommendationsPage />} />
          </Route>
          
          {/* Protected Admin Routes */}
          <Route element={<ProtectedAdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/resumes" element={<AdminResumesPage />} />
            <Route path="/admin/resumes/:resumeId" element={<AdminResumeDetailPage />} />
            <Route path="/admin/students" element={<AdminStudentsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            {/* Job Engine Admin Routes */}
            <Route path="/admin/jobs" element={<JobAdminListPage />} />
            <Route path="/admin/jobs/create" element={<JobAdminCreatePage />} />
            <Route path="/admin/jobs/:jobId/edit" element={<JobAdminEditPage />} />
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

