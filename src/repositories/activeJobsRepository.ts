import { JobStatus } from '@prisma/client';
import {
  JobRead,
  JobsRepository,
  JobWithDetails,
} from '../jobs/jobs.repository';
import { db } from '../utils/db.server';

export class ActiveJobsRepository extends JobsRepository {
  constructor() {
    super();
    this.where = {
      OR: [{ status: JobStatus.Drawing }, { status: JobStatus.Gathering }],
    };
  }
}

export const activeJobsRepository = new ActiveJobsRepository();
