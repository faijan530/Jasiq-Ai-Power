import { JobRepository } from '../repository/job.repository';
// JD Match would be imported here in the future
// import { JdMatchService } from '../../jd-match/service/jd-match.service';

export class JobRecommendationService {
  constructor(private readonly jobRepository: JobRepository) {}

  async recommendJobs(userId: string, resumeId: string): Promise<any[]> {
    // Call JD Match module internally
    // Mocking recommendation for now
    
    const jobs = await this.jobRepository.search({});
    
    const rankedJobs = jobs.map(job => ({
      job,
      matchScore: Math.floor(Math.random() * 100) // Mock score
    })).sort((a, b) => b.matchScore - a.matchScore);

    return rankedJobs;
  }
}
