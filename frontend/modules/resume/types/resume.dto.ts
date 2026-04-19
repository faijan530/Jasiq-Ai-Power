export type UUID = string;

// Canonical Resume JSON schema (must match backend validator rules)
export interface CanonicalResumeJson {
  schemaVersion: 1;
  basics: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  skills: Array<{ name: string; level: string }>;
  projects: Array<{
    title: string;
    description: string;
    techStack: string[];
    link: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    startYear: string;
    endYear: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    responsibilities: string[];
  }>;
  achievements: string[];
  links: Array<{ label: string; url: string }>;
}

export interface ResumeVersionDto {
  id: UUID;
  resumeId: UUID;
  versionNumber: number;
  resumeJson: CanonicalResumeJson;
  createdAt: string;
}

export interface ResumeResponseDto {
  id: UUID;
  userId: UUID;
  tenantId: UUID;
  title: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  latestVersion?: ResumeVersionDto;
}

export interface RenderPdfResponseDto {
  html: string;
  pdfUrl: string;
}

// Backend always returns:
// { success: true, data: ..., requestId: string }
export interface ApiEnvelope<T> {
  success: true;
  data: T;
  requestId: string;
}

export interface CreateResumeRequestDto {
  title: string;
  resumeJson: CanonicalResumeJson;
}

/** POST /resume success body: same as `ResumeResponseDto` with `resumeId` alias for `id`. */
export type CreateResumeApiResult = ResumeResponseDto & { resumeId: UUID };

export interface UpdateResumeRequestDto {
  title?: string;
  resumeJson: CanonicalResumeJson;
}

