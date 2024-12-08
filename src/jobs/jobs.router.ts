import { Router } from 'express';
import { JobsService } from './jobs.service';
import jobsRepository from './jobs.repository';

export const jobsRouter = Router();

// Get all jobs
jobsRouter.get('/', async (req, res) => {
  const jobsService = new JobsService(jobsRepository);
  const jobs = await jobsService.getJobs();
  res.json({ jobs });
});

// Get job by id
jobsRouter.get('/:id', async (req, res) => {
  const jobsService = new JobsService(jobsRepository);
  res.json(await jobsService.getJobById(parseInt(req.params.id, 10)));
});

// Create a job
jobsRouter.post('/', async (req, res) => {
  const jobsService = new JobsService(jobsRepository);
  try {
    const job = await jobsService.createJob(req.body);
    res.status(201).json(job);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Update a job
jobsRouter.put('/:id', async (req, res) => {
  const jobsService = new JobsService(jobsRepository);
  res.json(await jobsService.updateJob(parseInt(req.params.id, 10), req.body));
});

// Partially update a job
jobsRouter.patch('/:id', async (req, res) => {
  const jobsService = new JobsService(jobsRepository);
  try {
    console.log(
      `Received request to partially update job: ${
        req.params.id
      } body: ${JSON.stringify(req.body)}`
    );
    const updatedJob = await jobsService.partialUpdateJob(
      parseInt(req.params.id, 10),
      req.body
    );
    res.json(updatedJob);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a job
jobsRouter.delete('/:id', async (req, res) => {
  const jobsService = new JobsService(jobsRepository);
  res.json(await jobsService.deleteJob(parseInt(req.params.id, 10)));
});
