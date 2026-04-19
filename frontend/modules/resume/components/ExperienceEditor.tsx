import type { CanonicalResumeJson } from "../types/resume.dto";
import type { FieldErrorMap } from "../utils/resume.validation";
import { sanitizeText } from "../utils/sanitize";

const toResponsibilitiesString = (responsibilities: string[]) =>
  Array.isArray(responsibilities) ? responsibilities.filter(Boolean).join("\n") : "";

const parseResponsibilities = (value: string): string[] =>
  value
    .split(/\n|,/g)
    .map((x) => sanitizeText(x))
    .map((x) => x.trim())
    .filter(Boolean);

export function ExperienceEditor({
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
  const experience = resumeJson.experience ?? [];

  const addExperience = () => {
    update("experience", [
      ...experience,
      { company: "", role: "", duration: "", responsibilities: [] },
    ]);
  };

  const removeExperience = (idx: number) => {
    update("experience", experience.filter((_, i) => i !== idx));
  };

  const updateEntry = (idx: number, patch: any) => {
    update(
      "experience",
      experience.map((x, i) => (i === idx ? { ...x, ...patch } : x))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Experience</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">Responsibilities are required for scoring.</div>
        </div>
        <button
          type="button"
          disabled={!canEdit}
          onClick={addExperience}
          className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:text-slate-300">
          No experience yet.
        </div>
      ) : null}

      <div className="space-y-3">
        {experience.map((x, idx) => {
          const respError = errors[`experience.${idx}.responsibilities`];
          return (
            <div key={idx} className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Company</label>
                  <input
                    className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                    value={x.company}
                    disabled={!canEdit}
                    onChange={(e) => updateEntry(idx, { company: sanitizeText(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Role</label>
                  <input
                    className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                    value={x.role}
                    disabled={!canEdit}
                    onChange={(e) => updateEntry(idx, { role: sanitizeText(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Duration</label>
                  <input
                    className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                    value={x.duration}
                    disabled={!canEdit}
                    onChange={(e) => updateEntry(idx, { duration: sanitizeText(e.target.value) })}
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Responsibilities (one per line)</label>
                <textarea
                  rows={4}
                  className={[
                    "mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1",
                    respError ? "ring-red-400/70" : "ring-slate-200",
                    "dark:bg-slate-900 dark:ring-slate-800",
                  ].join(" ")}
                  value={toResponsibilitiesString(x.responsibilities)}
                  disabled={!canEdit}
                  onChange={(e) => updateEntry(idx, { responsibilities: parseResponsibilities(e.target.value) })}
                />
                {respError ? <div className="mt-1 text-xs text-red-600 dark:text-red-400">{respError}</div> : null}
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  disabled={!canEdit}
                  onClick={() => removeExperience(idx)}
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

