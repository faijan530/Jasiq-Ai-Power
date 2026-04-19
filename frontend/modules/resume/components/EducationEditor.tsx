import type { CanonicalResumeJson } from "../types/resume.dto";
import type { FieldErrorMap } from "../utils/resume.validation";
import { sanitizeText } from "../utils/sanitize";

export function EducationEditor({
  canEdit,
  resumeJson,
  errors,
  update,
}: {
  canEdit: boolean;
  resumeJson: CanonicalResumeJson;
  errors: FieldErrorMap; // reserved for future strict rules
  update: (path: string, value: unknown) => void;
}) {
  const education = resumeJson.education ?? [];

  const addEducation = () => {
    update("education", [
      ...education,
      { institution: "", degree: "", startYear: "", endYear: "" },
    ]);
  };

  const removeEducation = (idx: number) => {
    update("education", education.filter((_, i) => i !== idx));
  };

  const updateEntry = (idx: number, patch: any) => {
    update(
      "education",
      education.map((x, i) => (i === idx ? { ...x, ...patch } : x))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Education</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">Add your institution and degree details.</div>
        </div>
        <button
          type="button"
          disabled={!canEdit}
          onClick={addEducation}
          className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add
        </button>
      </div>

      {education.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:text-slate-300">
          No education entries yet.
        </div>
      ) : null}

      <div className="space-y-3">
        {education.map((e, idx) => {
          return (
            <div key={idx} className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Institution</label>
                  <input
                    className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                    value={e.institution}
                    disabled={!canEdit}
                    onChange={(ev) => updateEntry(idx, { institution: sanitizeText(ev.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Degree</label>
                  <input
                    className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                    value={e.degree}
                    disabled={!canEdit}
                    onChange={(ev) => updateEntry(idx, { degree: sanitizeText(ev.target.value) })}
                  />
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Start Year</label>
                  <input
                    className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                    value={e.startYear}
                    disabled={!canEdit}
                    onChange={(ev) => updateEntry(idx, { startYear: sanitizeText(ev.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">End Year</label>
                  <input
                    className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                    value={e.endYear}
                    disabled={!canEdit}
                    onChange={(ev) => updateEntry(idx, { endYear: sanitizeText(ev.target.value) })}
                  />
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  disabled={!canEdit}
                  onClick={() => removeEducation(idx)}
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

