import type { CanonicalResumeJson } from "../types/resume.dto";

/**
 * Default empty template (spec shape). `skills` may be empty here.
 */
export function getDefaultResumeJson(): CanonicalResumeJson {
  return {
    schemaVersion: 1,
    basics: {
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    skills: [],
    projects: [],
    education: [],
    experience: [],
    achievements: [],
    links: [],
  };
}

/** Backend `ResumeValidator` requires a valid email and at least one skill row. */
export function applyCreateResumeServerDefaults(
  draft: CanonicalResumeJson,
  contactEmail: string
): CanonicalResumeJson {
  const email = contactEmail.trim();
  return {
    ...draft,
    basics: { ...draft.basics, email },
    skills: draft.skills.length > 0 ? draft.skills : [{ name: "", level: "" }],
  };
}

export const DEFAULT_NEW_RESUME_TITLE = "My Resume";
