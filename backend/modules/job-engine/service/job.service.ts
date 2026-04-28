import { JobRepository } from '../repository/job.repository';
import { JobNormalizerService } from './job-normalizer.service';
import { JobRecommendationService } from './job-recommendation.service';
import { JobId } from '../domain/value-objects/job-id.vo';
import { Job } from '../domain/entities/job.entity';
import { CreateJobDto } from '../dto/create-job.dto';
import { SearchJobDto } from '../dto/search-job.dto';
import { JobValidator } from '../validators/job.validator';
import { logger } from '../../../core/logger';
import { EventEmitter } from 'events';
import { JobCreatedEvent } from '../domain/events/job-created.event';
import { JobUpdatedEvent } from '../domain/events/job-updated.event';

// Simple error classes for demonstration
export class ForbiddenError extends Error { constructor(msg: string) { super(msg); this.name = 'ForbiddenError'; } }
export class UnauthorizedError extends Error { constructor(msg: string) { super(msg); this.name = 'UnauthorizedError'; } }
export class NotFoundError extends Error { constructor(msg: string) { super(msg); this.name = 'NotFoundError'; } }

export interface RequestContext {
  userId: string;
  tenantId: string | null;
  roles: string[];
}

export class JobService {
  private eventEmitter = new EventEmitter();

  constructor(
    private readonly jobRepository: JobRepository,
    private readonly normalizer: JobNormalizerService,
    private readonly recommendationService: JobRecommendationService
  ) {}

  async addJob(dto: CreateJobDto, context: RequestContext): Promise<Job> {
    if (!context.roles.includes('COLLEGE_ADMIN') && !context.roles.includes('ADMIN') && !context.roles.includes('SYSTEM')) {
      throw new ForbiddenError("You cannot perform this action on jobs.");
    }

    JobValidator.validateCreate(dto);
    const normalizedDto = this.normalizer.normalize(dto);
    
    // Assign tenant id based on context if not system
    const tenantIdToUse = context.roles.includes('SYSTEM') ? normalizedDto.tenantId : context.tenantId;

    const job = new Job(
      JobId.generate(),
      tenantIdToUse,
      normalizedDto.title,
      normalizedDto.company,
      normalizedDto.location,
      normalizedDto.employmentType,
      normalizedDto.skillsRequired || [],
      normalizedDto.minExperience,
      normalizedDto.maxExperience,
      normalizedDto.jdText,
      normalizedDto.source,
      normalizedDto.applyLink,
      normalizedDto.postedAt,
      new Date(),
      new Date()
    );

    const savedJob = await this.jobRepository.save(job);
    logger.info("Job added", { jobId: savedJob.id.value, tenantId: savedJob.tenantId });
    this.eventEmitter.emit('job.created', new JobCreatedEvent(savedJob.id.value, savedJob.tenantId));

    return savedJob;
  }

  async updateJob(id: string, dto: Partial<CreateJobDto>, context: RequestContext): Promise<Job> {
    if (!context.roles.includes('COLLEGE_ADMIN') && !context.roles.includes('ADMIN') && !context.roles.includes('SYSTEM')) {
      throw new ForbiddenError("You cannot perform this action on jobs.");
    }

    const existingJob = await this.jobRepository.findById(id);
    if (!existingJob) {
      throw new NotFoundError("Job not found");
    }

    if (existingJob.tenantId !== null && existingJob.tenantId !== context.tenantId && !context.roles.includes('SYSTEM')) {
      throw new UnauthorizedError("Tenant mismatch");
    }

    const normalizedDto = this.normalizer.normalize({ ...existingJob, ...dto } as CreateJobDto);
    const updatedJob = new Job(
      existingJob.id,
      existingJob.tenantId,
      normalizedDto.title,
      normalizedDto.company,
      normalizedDto.location,
      normalizedDto.employmentType,
      normalizedDto.skillsRequired || [],
      normalizedDto.minExperience,
      normalizedDto.maxExperience,
      normalizedDto.jdText,
      normalizedDto.source,
      normalizedDto.applyLink,
      normalizedDto.postedAt,
      existingJob.createdAt,
      new Date()
    );

    const savedJob = await this.jobRepository.save(updatedJob);
    logger.info("Job updated", { jobId: savedJob.id.value, tenantId: savedJob.tenantId });
    this.eventEmitter.emit('job.updated', new JobUpdatedEvent(savedJob.id.value, savedJob.tenantId));

    return savedJob;
  }

  async getJobById(id: string, context: RequestContext): Promise<Job | null> {
    const job = await this.jobRepository.findById(id);
    if (job && job.tenantId !== null && job.tenantId !== context.tenantId) {
      throw new UnauthorizedError("Tenant mismatch");
    }
    return job;
  }

  async listJobs(filters: SearchJobDto, context: RequestContext): Promise<Job[]> {
    if (!context.roles.includes('STUDENT') && !context.roles.includes('SYSTEM') && !context.roles.includes('COLLEGE_ADMIN') && !context.roles.includes('ADMIN')) {
      throw new ForbiddenError("You cannot perform this action on jobs.");
    }
    
    // Add tenant filter if not system
    if (!context.roles.includes('SYSTEM') && context.tenantId) {
      filters.tenantId = context.tenantId;
    }
    return this.jobRepository.list(filters);
  }

  async searchJobs(filters: SearchJobDto, context: RequestContext): Promise<Job[]> {
    if (!context.roles.includes('STUDENT') && !context.roles.includes('SYSTEM') && !context.roles.includes('COLLEGE_ADMIN') && !context.roles.includes('ADMIN')) {
      throw new ForbiddenError("You cannot perform this action on jobs.");
    }

    if (!context.roles.includes('SYSTEM') && context.tenantId) {
      filters.tenantId = context.tenantId;
    }
    return this.jobRepository.search(filters);
  }

  async filterJobs(filters: SearchJobDto, context: RequestContext): Promise<Job[]> {
    return this.searchJobs(filters, context);
  }

  async recommendJobs(userId: string, resumeId: string, context: RequestContext): Promise<any[]> {
    if (!context.roles.includes('STUDENT')) {
      throw new ForbiddenError("You cannot perform this action on jobs.");
    }
    return this.recommendationService.recommendJobs(userId, resumeId);
  }
}
