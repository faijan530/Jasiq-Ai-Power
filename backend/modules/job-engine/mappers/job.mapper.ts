import { Job } from '../domain/entities/job.entity';
import { JobId } from '../domain/value-objects/job-id.vo';
import { JobResponseDto } from '../dto/job-response.dto';

export class JobMapper {
  static toDomain(raw: any): Job {
    return new Job(
      new JobId(raw.id),
      raw.tenant_id || raw.tenantId,
      raw.title,
      raw.company,
      raw.location,
      raw.employment_type || raw.employmentType,
      typeof raw.skills_required === 'string' ? JSON.parse(raw.skills_required) : (raw.skills_required || raw.skillsRequired || []),
      raw.min_experience !== undefined ? raw.min_experience : raw.minExperience,
      raw.max_experience !== undefined ? raw.max_experience : raw.maxExperience,
      raw.jd_text || raw.jdText,
      raw.source,
      raw.apply_link || raw.applyLink,
      raw.posted_at || raw.postedAt,
      raw.created_at || raw.createdAt,
      raw.updated_at || raw.updatedAt
    );
  }

  static toResponse(job: Job): JobResponseDto {
    return {
      id: job.id.value,
      tenantId: job.tenantId,
      title: job.title,
      company: job.company,
      location: job.location,
      employmentType: job.employmentType,
      skillsRequired: job.skillsRequired,
      minExperience: job.minExperience,
      maxExperience: job.maxExperience,
      jdText: job.jdText,
      source: job.source,
      applyLink: job.applyLink,
      postedAt: job.postedAt,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };
  }
}
