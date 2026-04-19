import type { CanonicalResumeJson } from "../types/resume.dto";
import type { FieldErrorMap } from "../utils/resume.validation";
import { sanitizeText, sanitizeUrl } from "../utils/sanitize";

export function LinkEditor({
  canEdit,
  resumeJson,
  errors, // reserved for strict rules
  update,
}: {
  canEdit: boolean;
  resumeJson: CanonicalResumeJson;
  errors: FieldErrorMap;
  update: (path: string, value: unknown) => void;
}) {
  const links = resumeJson.links ?? [];

  const addLink = () => {
    update("links", [...links, { label: "", url: "" }]);
  };

  const removeLink = (idx: number) => {
    update("links", links.filter((_, i) => i !== idx));
  };

  const updateLink = (idx: number, patch: any) => {
    update(
      "links",
      links.map((l, i) => (i === idx ? { ...l, ...patch } : l))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Links</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">Only http/https URLs will be saved.</div>
        </div>
        <button
          type="button"
          disabled={!canEdit}
          onClick={addLink}
          className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add
        </button>
      </div>

      {links.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:text-slate-300">
          No links yet.
        </div>
      ) : null}

      <div className="space-y-3">
        {links.map((l, idx) => (
          <div key={idx} className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Label</label>
                <input
                  className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                  value={l.label}
                  disabled={!canEdit}
                  onChange={(e) => updateLink(idx, { label: sanitizeText(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">URL</label>
                <input
                  className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                  value={l.url}
                  disabled={!canEdit}
                  onChange={(e) => updateLink(idx, { url: sanitizeUrl(e.target.value) })}
                />
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                disabled={!canEdit}
                onClick={() => removeLink(idx)}
                className="rounded-xl bg-red-600/10 px-3 py-2 text-sm font-semibold text-red-700 ring-1 ring-red-600/20 hover:bg-red-600/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

