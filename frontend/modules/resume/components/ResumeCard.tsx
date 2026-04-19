import type { ReactNode } from "react";

export function ResumeCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      {children}
    </div>
  );
}

