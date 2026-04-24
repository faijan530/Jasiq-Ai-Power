import { lazy } from "react";

const JDMatchPage = lazy(() => 
  import("./pages/JDMatchPage").then((m) => ({ default: m.JDMatchPage }))
);

export const getJDMatchRoutes = () => [
  {
    path: "/app/jd-match",
    element: <JDMatchPage />,
  },
];
