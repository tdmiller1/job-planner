import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { jobsRouter } from './jobs/jobs.router';

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
