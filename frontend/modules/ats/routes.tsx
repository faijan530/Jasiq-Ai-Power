import { lazy } from "react";

const ATSAnalyzerPage = lazy(() => import("./pages/ATSAnalyzerPage"));

export const getATSRoutes = () => [
  {
    path: "/app/ats",
    element: <ATSAnalyzerPage />,
  },
];
