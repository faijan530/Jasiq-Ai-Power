import { Job, RecommendedJob } from '../types/job.model';
import { JobResponseDto } from '../types/job.dto';

export const mapJobResponseToModel = (dto: JobResponseDto): Job => ({
  ...dto,
  postedAt: dto.postedAt ? new Date(dto.postedAt) : null,
  createdAt: new Date(dto.createdAt),
  updatedAt: new Date(dto.updatedAt),
});

export const mapRecommendedJobResponseToModel = (data: { job: JobResponseDto; matchScore: number }): RecommendedJob => ({
  job: mapJobResponseToModel(data.job),
  matchScore: data.matchScore,
});
