import type { CanonicalResumeJson } from "./create-resume.dto";

export interface UpdateResumeDto {
  title?: string;
  resumeJson: CanonicalResumeJson;
}

