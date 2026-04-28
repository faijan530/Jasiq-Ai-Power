import { EventEmitter } from 'events';
import { logger } from '../../../core/logger';
import { JobCreatedEvent } from '../domain/events/job-created.event';

export class JobAlertWorker {
  constructor(private readonly eventEmitter: EventEmitter) {}

  start() {
    logger.info("Job alert worker started");
    
    this.eventEmitter.on('job.created', async (event: JobCreatedEvent) => {
      try {
        logger.info(`Triggering notifications for newly created job`, { jobId: event.jobId, tenantId: event.tenantId });
        // Fetch candidates with matching profiles
        // Send email / in-app notifications
      } catch (error) {
        logger.error("Job alert trigger failed", { error });
      }
    });
  }
}
