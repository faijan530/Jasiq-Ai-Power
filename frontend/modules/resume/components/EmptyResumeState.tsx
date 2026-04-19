export function EmptyResumeState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-8 text-center">
      <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">No resume loaded</div>
      <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Create a resume first, then edit sections and save to generate a new version.
      </div>
    </div>
  );
}

