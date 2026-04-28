export interface CreateJobDto {
  tenantId?: string | null;
  title: string;
  company: string;
  location?: string | null;
  employmentType?: string | null;
  skillsRequired?: string[];
  minExperience?: number | null;
  maxExperience?: number | null;
  jdText: string;
  source?: string | null;
  applyLink?: string | null;
  postedAt?: Date | null;
}
