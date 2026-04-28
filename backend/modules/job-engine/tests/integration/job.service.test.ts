import { JobService } from '../../service/job.service';
import { JobRepository } from '../../repository/job.repository';
import { JobNormalizerService } from '../../service/job-normalizer.service';
import { JobRecommendationService } from '../../service/job-recommendation.service';
import { CreateJobDto } from '../../dto/create-job.dto';

describe('JobService Integration', () => {
  let jobService: JobService;
  let jobRepository: any;

  beforeEach(() => {
    // Mocking repository for integration test isolation
    jobRepository = {
      save: jest.fn().mockImplementation(job => Promise.resolve(job)),
      search: jest.fn().mockResolvedValue([])
    };
    const normalizer = new JobNormalizerService();
    const recommendationService = new JobRecommendationService(jobRepository as JobRepository);
    
    jobService = new JobService(jobRepository as JobRepository, normalizer, recommendationService);
  });

  it('should create a job for admin and system roles', async () => {
    const dto: CreateJobDto = {
      title: 'Full Stack Developer',
      company: 'Tech Solutions',
      jdText: 'Great opportunity',
      tenantId: 'tenant-123'
    };

    const context = { userId: 'admin1', tenantId: 'tenant-123', roles: ['COLLEGE_ADMIN'] };
    
    const job = await jobService.addJob(dto, context);
    expect(job.title).toBe('Full Stack Developer');
    expect(job.tenantId).toBe('tenant-123');
    expect(jobRepository.save).toHaveBeenCalled();
  });

  it('should prevent student from creating a job', async () => {
    const dto: CreateJobDto = {
      title: 'Full Stack Developer',
      company: 'Tech Solutions',
      jdText: 'Great opportunity'
    };

    const context = { userId: 'student1', tenantId: 'tenant-123', roles: ['STUDENT'] };
    
    await expect(jobService.addJob(dto, context)).rejects.toThrow('You cannot perform this action on jobs.');
  });
});
