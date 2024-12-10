import { Router } from 'express';
import { JobsService } from './jobs.service';
import jobsRepository from './jobs.repository';

export const jobsRouter = Router();

// Get all jobs
jobsRouter.get('/', async (_, res, next) => {
  const jobsService = new JobsService(jobsRepository);

  jobsService
    .getJobs()
    .then((jobs) => res.status(201).json({ jobs }))
    .catch(next);
});

// Get job by id
jobsRouter.get('/:id', async (req, res, next) => {
  const jobsService = new JobsService(jobsRepository);
  jobsService
    .getJobById(parseInt(req.params.id, 10))
    .then((job) => res.status(200).json({ ...job }))
    .catch(next);
});

// Create a job
jobsRouter.post('/', async (req, res, next) => {
  const jobsService = new JobsService(jobsRepository);

  jobsService
    .createJob(req.body)
    .then((job) => res.status(201).json({ ...job }))
    .catch(next);
});

// Update a job
jobsRouter.put('/:id', async (req, res, next) => {
  const jobsService = new JobsService(jobsRepository);

  jobsService
    .updateJob(parseInt(req.params.id, 10), req.body)
    .then((job) => res.status(200).json({ ...job }))
    .catch(next);
});

// Partially update a job
jobsRouter.patch('/:id', async (req, res, next) => {
  const jobsService = new JobsService(jobsRepository);

  await jobsService
    .partialUpdateJob(parseInt(req.params.id, 10), req.body)
    .then((job) => res.status(200).json({ ...job }))
    .catch(next);
});

// Delete a job
jobsRouter.delete('/:id', async (req, res, next) => {
  const jobsService = new JobsService(jobsRepository);

  jobsService
    .deleteJob(parseInt(req.params.id, 10))
    .then(() => res.status(204).end())
    .catch(next);
});
