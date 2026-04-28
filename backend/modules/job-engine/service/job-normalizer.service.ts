import { CreateJobDto } from '../dto/create-job.dto';

export class JobNormalizerService {
  normalize(raw: Partial<CreateJobDto>): CreateJobDto {
    return {
      title: raw.title?.trim() || '',
      company: raw.company?.trim() || '',
      location: raw.location?.trim() || null,
      employmentType: raw.employmentType?.trim() || null,
      skillsRequired: Array.isArray(raw.skillsRequired) 
        ? raw.skillsRequired.map(s => s.trim().toLowerCase()).filter(Boolean)
        : [],
      minExperience: raw.minExperience || null,
      maxExperience: raw.maxExperience || null,
      jdText: raw.jdText?.trim() || '',
      applyLink: raw.applyLink?.trim() || null,
      source: raw.source?.trim() || 'MANUAL',
      postedAt: raw.postedAt ? new Date(raw.postedAt) : new Date(),
      tenantId: raw.tenantId || null
    };
  }
}
