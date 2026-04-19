import type { CanonicalResumeJson } from "../types/resume.dto";
import type { FieldErrorMap } from "../utils/resume.validation";
import { sanitizeText, sanitizeUrl } from "../utils/sanitize";

export function ProjectEditor({
  canEdit,
  resumeJson,
  errors,
  update,
}: {
  canEdit: boolean;
  resumeJson: CanonicalResumeJson;
  errors: FieldErrorMap;
  update: (path: string, value: unknown) => void;
}) {
  const projects = resumeJson.projects ?? [];

  const addProject = () => {
    const next = [
      ...projects,
      {
        title: "",
        description: "",
        techStack: [],
        link: "",
      },
    ];
    update("projects", next);
  };

  const removeProject = (idx: number) => {
    update(
      "projects",
      projects.filter((_, i) => i !== idx)
    );
  };

  const updateProject = (idx: number, patch: any) => {
    const next = projects.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    update("projects", next);
  };

  const techStackToString = (tech: string[]) => (Array.isArray(tech) ? tech.join(", ") : "");

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Projects</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">Each project needs a title and description.</div>
        </div>
        <button
          type="button"
          disabled={!canEdit}
          onClick={addProject}
          className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:text-slate-300">
          No projects yet.
        </div>
      ) : null}

      <div className="space-y-3">
        {projects.map((p, idx) => {
          const titleError = errors[`projects.${idx}.title`];
          const descError = errors[`projects.${idx}.description`];
          return (
            <div key={idx} className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Title</label>
                  <input
                    className={[
                      "mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1",
                      titleError ? "ring-red-400/70" : "ring-slate-200",
                      "dark:bg-slate-900 dark:ring-slate-800",
                    ].join(" ")}
                    value={p.title}
                    disabled={!canEdit}
                    onChange={(e) => updateProject(idx, { title: sanitizeText(e.target.value) })}
                  />
                  {titleError ? <div className="mt-1 text-xs text-red-600 dark:text-red-400">{titleError}</div> : null}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Link (http/https only)</label>
                  <input
                    className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                    value={p.link}
                    disabled={!canEdit}
                    onChange={(e) => updateProject(idx, { link: sanitizeUrl(e.target.value) })}
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Description</label>
                <textarea
                  rows={3}
                  className={[
                    "mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1",
                    descError ? "ring-red-400/70" : "ring-slate-200",
                    "dark:bg-slate-900 dark:ring-slate-800",
                  ].join(" ")}
                  value={p.description}
                  disabled={!canEdit}
                  onChange={(e) => updateProject(idx, { description: sanitizeText(e.target.value) })}
                />
                {descError ? <div className="mt-1 text-xs text-red-600 dark:text-red-400">{descError}</div> : null}
              </div>

              <div className="mt-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Tech Stack (comma-separated)</label>
                <input
                  className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                  value={techStackToString(p.techStack)}
                  disabled={!canEdit}
                  onChange={(e) => {
                    const parts = e.target.value
                      .split(",")
                      .map((x) => sanitizeText(x))
                      .filter(Boolean);
                    updateProject(idx, { techStack: parts });
                  }}
                />
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  disabled={!canEdit}
                  onClick={() => removeProject(idx)}
                  className="rounded-xl bg-red-600/10 px-3 py-2 text-sm font-semibold text-red-700 ring-1 ring-red-600/20 hover:bg-red-600/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

