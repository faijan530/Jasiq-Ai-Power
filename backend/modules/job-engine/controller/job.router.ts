import { Router } from 'express';
import { JobController } from './job.controller';
import { JobService } from '../service/job.service';
import { JobRepository } from '../repository/job.repository';
import { JobNormalizerService } from '../service/job-normalizer.service';
import { JobRecommendationService } from '../service/job-recommendation.service';

const router = Router();

const jobRepository = new JobRepository();
const jobNormalizerService = new JobNormalizerService();
const jobRecommendationService = new JobRecommendationService(jobRepository);
const jobService = new JobService(jobRepository, jobNormalizerService, jobRecommendationService);
const jobController = new JobController(jobService);

router.post('/', (req, res) => jobController.createJob(req, res));
router.get('/', (req, res) => jobController.listJobs(req, res));
router.post('/search', (req, res) => jobController.searchJobs(req, res));
router.get('/tenant', (req, res) => jobController.getTenantJobs(req, res));
router.post('/recommend', (req, res) => jobController.recommendJobs(req, res));
router.get('/:id', (req, res) => jobController.getJobById(req, res));
router.put('/:id', (req, res) => jobController.updateJob(req, res));

export { router as jobRouter };
