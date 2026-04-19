import type { CanonicalResumeJson } from "../types/resume.dto";
import type { FieldErrorMap } from "../utils/resume.validation";

import { SkillEditor } from "./SkillEditor";
import { ProjectEditor } from "./ProjectEditor";
import { ExperienceEditor } from "./ExperienceEditor";
import { EducationEditor } from "./EducationEditor";
import { LinkEditor } from "./LinkEditor";
import { sanitizeText } from "../utils/sanitize";

type SectionKey =
  | "personal"
  | "summary"
  | "education"
  | "experience"
  | "skills"
  | "projects"
  | "links";

export function ResumeSectionForm({
  section,
  canEdit,
  resumeJson,
  errors,
  update,
  resumeTitle,
  setResumeTitle,
}: {
  section: SectionKey;
  canEdit: boolean;
  resumeJson: CanonicalResumeJson;
  errors: FieldErrorMap;
  update: (path: string, value: unknown) => void;
  resumeTitle?: string;
  setResumeTitle?: (title: string) => void;
}) {
  if (section === "personal") {
    return (
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Name</label>
          <input
            className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
            value={resumeJson.basics.name}
            disabled={!canEdit}
            onChange={(e) => update("basics.name", sanitizeText(e.target.value))}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Email</label>
          <input
            className={[
              "mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1",
              errors["basics.email"] ? "ring-red-400/70" : "ring-slate-200",
              "dark:bg-slate-950 dark:ring-slate-800",
            ].join(" ")}
            value={resumeJson.basics.email}
            disabled={!canEdit}
            onChange={(e) => update("basics.email", sanitizeText(e.target.value))}
          />
          {errors["basics.email"] ? (
            <div className="mt-1 text-xs text-red-600 dark:text-red-400">{errors["basics.email"]}</div>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Phone</label>
            <input
              className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
              value={resumeJson.basics.phone}
              disabled={!canEdit}
            onChange={(e) => update("basics.phone", sanitizeText(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Location</label>
            <input
              className="mt-1 w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
              value={resumeJson.basics.location}
              disabled={!canEdit}
            onChange={(e) => update("basics.location", sanitizeText(e.target.value))}
            />
          </div>
        </div>
      </div>
    );
  }

  if (section === "summary") {
    return (
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Summary</label>
        <textarea
          rows={6}
          className="w-full rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800"
          value={resumeJson.basics.summary}
          disabled={!canEdit}
          onChange={(e) => update("basics.summary", sanitizeText(e.target.value))}
        />
      </div>
    );
  }

  if (section === "skills") return <SkillEditor canEdit={canEdit} resumeJson={resumeJson} errors={errors} update={update} />;
  if (section === "projects") return <ProjectEditor canEdit={canEdit} resumeJson={resumeJson} errors={errors} update={update} />;
  if (section === "experience") return <ExperienceEditor canEdit={canEdit} resumeJson={resumeJson} errors={errors} update={update} />;
  if (section === "education") return <EducationEditor canEdit={canEdit} resumeJson={resumeJson} errors={errors} update={update} />;
  if (section === "links") return <LinkEditor canEdit={canEdit} resumeJson={resumeJson} errors={errors} update={update} />;

  return null;
}

