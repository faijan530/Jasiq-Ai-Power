import type { CanonicalResumeJson } from "./create-resume.dto";

export interface ResumeResponseDto {
  id: string;
  userId: string;
  tenantId: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  latestVersion?: {
    id: string;
    versionNumber: number;
    resumeJson: CanonicalResumeJson;
    createdAt: string;
  };
}

