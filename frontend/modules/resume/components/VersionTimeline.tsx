import type { ResumeVersionDto } from "../types/resume.dto";

export function VersionTimeline({
  versions,
  currentVersionId,
  onSelect,
}: {
  versions: ResumeVersionDto[];
  currentVersionId: string | null | undefined;
  onSelect: (versionId: string) => void;
}) {
  const sorted = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);

  return (
    <div className="rounded-xl bg-white p-4 shadow-md ring-1 ring-slate-200/80">
      <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">Version Timeline</div>
      {sorted.length === 0 ? (
        <div className="text-sm text-slate-600 dark:text-slate-300">No versions yet.</div>
      ) : (
        <div className="space-y-2">
          {sorted.map((v) => {
            const isCurrent = currentVersionId === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelect(v.id)}
                className={[
                  "w-full rounded-xl px-3 py-2 text-left text-sm ring-1 transition",
                  isCurrent
                    ? "bg-blue-600/10 ring-blue-600/30 text-blue-800 dark:text-blue-300"
                    : "bg-white ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:ring-slate-800 dark:hover:bg-slate-800 dark:text-slate-100",
                ].join(" ")}
              >
                <div className="font-semibold">v{v.versionNumber}</div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {new Date(v.createdAt).toLocaleString()}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

