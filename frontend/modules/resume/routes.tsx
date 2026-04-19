import { lazy } from "react";
import { Navigate } from "react-router-dom";

const ResumeListPage = lazy(() => import("./pages/ResumeListPage"));
const ResumeEditorPage = lazy(() => import("./pages/ResumeEditorPage").then((m) => ({ default: m.ResumeEditorPage })));
const ResumeVersionHistoryPage = lazy(() =>
  import("./pages/ResumeVersionHistoryPage").then((m) => ({ default: m.ResumeVersionHistoryPage }))
);
const ResumeVersionViewerPage = lazy(() =>
  import("./pages/ResumeVersionViewerPage").then((m) => ({ default: m.ResumeVersionViewerPage }))
);
const ResumePdfViewerPage = lazy(() =>
  import("./pages/ResumePdfViewerPage").then((m) => ({ default: m.ResumePdfViewerPage }))
);

export interface CurrentUser {
  id: string;
  tenantId: string;
  role: "STUDENT" | "ADMIN" | string;
  /** When set (e.g. from auth), used as default work email for new resumes */
  email?: string;
}

export const getResumeRoutes = (currentUser: CurrentUser) => [
  {
    path: "/app/resume",
    element: <ResumeListPage currentUser={currentUser} />,
  },
  {
    path: "/app/resume/create",
    element: <Navigate to="/app/resume" replace />,
  },
  {
    path: "/app/resume/:resumeId",
    element: <ResumeEditorPage currentUser={currentUser} />,
  },
  {
    path: "/app/resume/:resumeId/edit",
    element: <ResumeEditorPage currentUser={currentUser} />,
  },
  {
    path: "/app/resume/:resumeId/versions",
    element: <ResumeVersionHistoryPage currentUser={currentUser} />,
  },
  {
    path: "/app/resume/:resumeId/version/:versionId",
    element: <ResumeVersionViewerPage currentUser={currentUser} />,
  },
  {
    path: "/app/resume/:resumeId/pdf",
    element: <ResumePdfViewerPage currentUser={currentUser} />,
  },
];

