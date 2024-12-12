import { Router } from 'express';
import { JobsService } from './jobs.service';
import jobsRepository from './jobs.repository';

export const jobsRouter = Router();

// Get all jobs
jobsRouter.get('/', async (_, res, next) => {
  const jobsService = new JobsService();

  jobsService
    .getJobs()
    .then((jobs) => res.status(200).json({ jobs }))
    .catch(next);
});

// Get all active jobs
jobsRouter.get('/active', async (_, res, next) => {
  const jobsService = new JobsService();

  jobsService
    .getJobs({
      active: true,
    })
    .then((jobs) => res.status(200).json({ jobs }))
    .catch(next);
});

// Get all completed jobs
jobsRouter.get('/completed', async (_, res, next) => {
  const jobsService = new JobsService();

  jobsService
    .getJobs()
    .then((jobs) => res.status(200).json({ jobs }))
    .catch(next);
});

// Get job by id
jobsRouter.get('/:id', async (req, res, next) => {
  const jobsService = new JobsService();
  jobsService
    .getJobById(parseInt(req.params.id, 10))
    .then((job) => res.status(200).json({ ...job }))
    .catch(next);
});

// Create a job
jobsRouter.post('/', async (req, res, next) => {
  const jobsService = new JobsService();

  jobsService
    .createJob(req.body)
    .then((job) => res.status(201).json({ ...job }))
    .catch(next);
});

// Update a job
jobsRouter.put('/:id', async (req, res, next) => {
  const jobsService = new JobsService();

  jobsService
    .updateJob(parseInt(req.params.id, 10), req.body)
    .then((job) => res.status(200).json({ ...job }))
    .catch(next);
});

// Partially update a job
jobsRouter.patch('/:id', async (req, res, next) => {
  const jobsService = new JobsService();

  await jobsService
    .partialUpdateJob(parseInt(req.params.id, 10), req.body)
    .then((job) => res.status(200).json({ ...job }))
    .catch(next);
});

// Delete a job
jobsRouter.delete('/:id', async (req, res, next) => {
  const jobsService = new JobsService();

  jobsService
    .deleteJob(parseInt(req.params.id, 10))
    .then(() => res.status(204).end())
    .catch(next);
});
