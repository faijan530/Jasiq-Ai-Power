import { Suspense, useMemo } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getResumeRoutes, CurrentUser } from "../modules/resume/routes";

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

export default function App() {
  const currentUser = useMemo(() => currentUserFromEnv(), []);
  const resumeRoutes = getResumeRoutes(currentUser);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Suspense fallback={<div className="p-6 text-sm text-slate-600">Loading...</div>}>
        <Routes>
          {resumeRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="*" element={<Navigate to="/app/resume" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

