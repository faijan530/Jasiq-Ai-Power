import { Request, Response } from 'express';
import { JobService, RequestContext } from '../service/job.service';
import { JobMapper } from '../mappers/job.mapper';
import { CreateJobDto } from '../dto/create-job.dto';
import { SearchJobDto } from '../dto/search-job.dto';

export class JobController {
  constructor(private readonly jobService: JobService) {}

  private getContext(req: Request): RequestContext {
    // Assuming `req.user` is populated by auth middleware
    const user: any = req.user || { id: 'test-user', tenantId: null, role: 'STUDENT' };
    return {
      userId: user.id,
      tenantId: user.tenantId,
      roles: user.roles || [user.role || 'STUDENT']
    };
  }

  async createJob(req: Request, res: Response) {
    try {
      const context = this.getContext(req);
      const dto: CreateJobDto = req.body;
      const job = await this.jobService.addJob(dto, context);
      res.status(201).json(JobMapper.toResponse(job));
    } catch (error: any) {
      if (error.name === 'ForbiddenError') res.status(403).json({ error: error.message });
      else if (error.name === 'UnauthorizedError') res.status(401).json({ error: error.message });
      else res.status(400).json({ error: error.message });
    }
  }

  async listJobs(req: Request, res: Response) {
    try {
      const context = this.getContext(req);
      const filters: SearchJobDto = req.query;
      const jobs = await this.jobService.listJobs(filters, context);
      res.status(200).json(jobs.map(JobMapper.toResponse));
    } catch (error: any) {
      if (error.name === 'ForbiddenError') res.status(403).json({ error: error.message });
      else res.status(400).json({ error: error.message });
    }
  }

  async getJobById(req: Request, res: Response) {
    try {
      const context = this.getContext(req);
      const { id } = req.params;
      const job = await this.jobService.getJobById(id, context);
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
      res.status(200).json(JobMapper.toResponse(job));
    } catch (error: any) {
      if (error.name === 'UnauthorizedError') res.status(401).json({ error: error.message });
      else res.status(400).json({ error: error.message });
    }
  }

  async searchJobs(req: Request, res: Response) {
    try {
      const context = this.getContext(req);
      const filters: SearchJobDto = req.body;
      const jobs = await this.jobService.searchJobs(filters, context);
      res.status(200).json(jobs.map(JobMapper.toResponse));
    } catch (error: any) {
      if (error.name === 'ForbiddenError') res.status(403).json({ error: error.message });
      else res.status(400).json({ error: error.message });
    }
  }

  async getTenantJobs(req: Request, res: Response) {
    try {
      const context = this.getContext(req);
      if (!context.tenantId) {
        return res.status(400).json({ error: 'No tenant ID in context' });
      }
      const filters: SearchJobDto = { tenantId: context.tenantId };
      const jobs = await this.jobService.searchJobs(filters, context);
      res.status(200).json(jobs.map(JobMapper.toResponse));
    } catch (error: any) {
      if (error.name === 'ForbiddenError') res.status(403).json({ error: error.message });
      else res.status(400).json({ error: error.message });
    }
  }

  async recommendJobs(req: Request, res: Response) {
    try {
      const context = this.getContext(req);
      const { resumeId } = req.body;
      const recommendedJobs = await this.jobService.recommendJobs(context.userId, resumeId, context);
      res.status(200).json(recommendedJobs.map(rj => ({
        job: JobMapper.toResponse(rj.job),
        matchScore: rj.matchScore
      })));
    } catch (error: any) {
      if (error.name === 'ForbiddenError') res.status(403).json({ error: error.message });
      else res.status(400).json({ error: error.message });
    }
  }

  async updateJob(req: Request, res: Response) {
    try {
      const context = this.getContext(req);
      const { id } = req.params;
      const dto: Partial<CreateJobDto> = req.body;
      const job = await this.jobService.updateJob(id, dto, context);
      res.status(200).json(JobMapper.toResponse(job));
    } catch (error: any) {
      if (error.name === 'ForbiddenError') res.status(403).json({ error: error.message });
      else if (error.name === 'UnauthorizedError') res.status(401).json({ error: error.message });
      else res.status(400).json({ error: error.message });
    }
  }
}
