import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { jobsRouter } from './jobs/jobs.router';
import { employeesRouter } from './employees/employees.router';
import { formattedError } from './utils/error';
import { db } from './utils/db.server';
import jobsRepository, { JobsRepository } from './jobs/jobs.repository';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

db.$use(async (params, next) => {
  const result = await next(params);

  const modelsToTrack = ['Job'];

  if (params.model && params.action && modelsToTrack.includes(params.model)) {
    switch (params.model) {
      case 'Job':
        await jobsRepository.enableAuditTracking(params, result);
    }
  }

  return result;
});

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.path}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  next();
});

app.use('/api/jobs', jobsRouter);
app.use('/api/employees', employeesRouter);

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);

  res.status(err.status || 500).send(formattedError(err));
  next(err);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
