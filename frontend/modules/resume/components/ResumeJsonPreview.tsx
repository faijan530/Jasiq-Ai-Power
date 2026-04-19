import type { CanonicalResumeJson } from "../types/resume.dto";

export function ResumeJsonPreview({ resumeJson }: { resumeJson: CanonicalResumeJson }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-md ring-1 ring-slate-200/80">
      <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Live JSON Preview</div>
      <pre className="max-h-[420px] overflow-auto rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 ring-1 ring-slate-200 dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-800">
        {JSON.stringify(resumeJson, null, 2)}
      </pre>
    </div>
  );
}

