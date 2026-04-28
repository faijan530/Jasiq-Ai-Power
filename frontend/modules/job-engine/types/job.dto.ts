export interface CreateJobDto {
  title: string;
  company: string;
  location?: string;
  employmentType?: string;
  skillsRequired: string[];
  minExperience?: number;
  maxExperience?: number;
  jdText: string;
  applyLink?: string;
}

export interface JobResponseDto {
  id: string;
  tenantId: string | null;
  title: string;
  company: string;
  location: string | null;
  employmentType: string | null;
  skillsRequired: string[];
  minExperience: number | null;
  maxExperience: number | null;
  jdText: string;
  source: string | null;
  applyLink: string | null;
  postedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
