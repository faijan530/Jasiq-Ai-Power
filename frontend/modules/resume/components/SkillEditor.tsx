import { useMemo, useState } from "react";
import type { CanonicalResumeJson } from "../types/resume.dto";
import type { FieldErrorMap } from "../utils/resume.validation";
import { sanitizeText } from "../utils/sanitize";

export function SkillEditor({
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
  const skills = resumeJson.skills ?? [];
  const dupError = errors["skills"];

  const addSkill = () => {
    const next = [...skills, { name: "", level: "" }];
    update("skills", next);
  };

  const removeSkill = (idx: number) => {
    const next = skills.filter((_, i) => i !== idx);
    update("skills", next);
  };

  const updateSkill = (idx: number, patch: Partial<{ name: string; level: string }>) => {
    const next = skills.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    update("skills", next);
  };

  const normalizedNames = useMemo(() => skills.map((s) => (s?.name ?? "").trim().toLowerCase()).filter(Boolean), [skills]);
  const duplicatesCount = useMemo(() => {
    const set = new Set<string>();
    let dup = 0;
    for (const n of normalizedNames) {
      if (set.has(n)) dup += 1;
      else set.add(n);
    }
    return dup;
  }, [normalizedNames]);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Skills</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            Add tools and technologies you know. Duplicates are not allowed.
          </div>
          {dupError ? <div className="mt-1 text-xs text-red-600 dark:text-red-400">{dupError}</div> : null}
          {duplicatesCount > 0 && !dupError ? (
            <div className="mt-1 text-xs text-red-600 dark:text-red-400">Duplicate skill names detected</div>
          ) : null}
        </div>

        <button
          type="button"
          disabled={!canEdit}
          onClick={addSkill}
          className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:text-slate-300">
          No skills yet.
        </div>
      ) : null}

      <div className="space-y-3">
        {skills.map((skill, idx) => {
          const nameError = errors[`skills.${idx}.name`];
          return (
            <div key={idx} className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Name</label>
                  <input
                    className={[
                      "mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1",
                      nameError ? "ring-red-400/70" : "ring-slate-200",
                      "dark:bg-slate-900 dark:ring-slate-800",
                    ].join(" ")}
                    value={skill.name}
                    disabled={!canEdit}
                    onChange={(e) => updateSkill(idx, { name: sanitizeText(e.target.value) })}
                  />
                  {nameError ? <div className="mt-1 text-xs text-red-600 dark:text-red-400">{nameError}</div> : null}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Level</label>
                  <input
                    className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
                    value={skill.level}
                    disabled={!canEdit}
                    onChange={(e) => updateSkill(idx, { level: sanitizeText(e.target.value) })}
                  />
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  disabled={!canEdit}
                  onClick={() => removeSkill(idx)}
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

