import type { CanonicalResumeJson, ResumeResponseDto, ResumeVersionDto } from "./resume.dto";

export type ResumeModel = ResumeResponseDto;
export type ResumeVersionModel = ResumeVersionDto;

// Editing model (always derived from current version; store maintains the mutable JSON)
export type ResumeJsonModel = CanonicalResumeJson;

export const createEmptyResumeJson = (): ResumeJsonModel => ({
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
});

