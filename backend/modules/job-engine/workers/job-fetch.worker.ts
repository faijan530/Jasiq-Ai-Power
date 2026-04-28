import { logger } from '../../../core/logger';
import { JobAggregationService } from '../service/job-aggregation.service';

export class JobFetchWorker {
  constructor(private readonly aggregationService: JobAggregationService) {}

  async start() {
    // Simulated cron job using setTimeout for now, in a real app use node-cron
    logger.info("Job fetch worker started");
    
    setInterval(async () => {
      try {
        const rawJobs = await this.aggregationService.fetchJobsFromAPI();
        const parsedJobs = await this.aggregationService.parseExternalJobs(rawJobs);
        logger.info(`Fetched and parsed ${parsedJobs.length} external jobs`);
        // Logic to insert into DB would go here
      } catch (error) {
        logger.error("Job fetch failed", { error });
      }
    }, 60 * 60 * 1000); // Hourly
  }
}
