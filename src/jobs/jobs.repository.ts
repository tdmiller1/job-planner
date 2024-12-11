import { Prisma } from '@prisma/client';
import { db } from '../utils/db.server';

export type JobRead = {
  id: number;
  name: string;
  updatedAt: Date;
  draftingHours: number;
  notes: string | null;
  orderedDate: Date;
};

type EmployeeRead = {
  id: number;
  firstName: string | null;
  lastName: string | null;
};

export type JobWithDetails = JobRead & {
  Manager: EmployeeRead;
  CrewForJob: Array<EmployeeRead>;
};

type JobWrite = {
  managerId: number;
  name: string;
  draftingHours: number;
  orderedDate: string;
  notes?: string;
};

export type CrewForJobRead = {
  id: number;
  employeeId: number;
  jobId: number;
};

export class JobsRepository {
  async getAllJobs(): Promise<Array<JobWithDetails>> {
    return await db.job
      .findMany({
        select: {
          id: true,
          name: true,
          updatedAt: true,
          draftingHours: true,
          Manager: true,
          notes: true,
          orderedDate: true,
          CrewForJob: {
            select: {
              employee: true,
            },
          },
        },
      })
      .then((jobs) =>
        jobs.map((job) => ({
          ...job,
          CrewForJob: job.CrewForJob.map(({ employee }) => ({ ...employee })),
        }))
      );
  }

  async getJobById(id: number): Promise<JobWithDetails> {
    return await db.job
      .findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          name: true,
          updatedAt: true,
          draftingHours: true,
          Manager: true,
          notes: true,
          orderedDate: true,
          CrewForJob: {
            select: {
              employee: true,
            },
          },
        },
      })
      .then((job) => ({
        ...job,
        CrewForJob: job.CrewForJob.map(({ employee }) => ({ ...employee })),
      }));
  }

  async createJob(data: JobWrite): Promise<JobRead> {
    return await db.job.create({
      data,
    });
  }

  async updateJob(id: number, data: JobWrite): Promise<JobRead> {
    try {
      return await db.job.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      throw new Error(`Server encountered error: ${error.message}`);
    }
  }

  async partialUpdateJob(
    id: number,
    data: Partial<JobWrite>
  ): Promise<JobRead> {
    try {
      console.log(`Updating job: ${id} with data: ${JSON.stringify(data)}`);
      return await db.job.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      throw new Error(`Server encountered error: ${error.message}`);
    }
  }

  async deleteJob(id: number): Promise<JobRead> {
    return await db.job.delete({
      where: { id },
    });
  }

  getTrackableActions(): Array<string> {
    return ['create', 'update', 'updateMany', 'delete'];
  }

  async enableAuditTracking(
    params: { action: string; args?: Prisma.JobUpdateArgs },
    result: JobRead & { managerId: number }
  ) {
    if (!params.action || !this.getTrackableActions().includes(params.action)) {
      return;
    }
    switch (params.action) {
      case 'create':
        this.trackSingle(params, result);
        break;
      case 'update':
        this.trackSingle(params, result);
        break;
      case 'updateMany':
        if (params.args) {
          this.trackUpdateMany(
            params as { action: string; args: Prisma.JobUpdateArgs }
          );
        }
        break;
      case 'delete':
        this.trackSingle(params, result);
        break;
      default:
        break;
    }
  }

  private async trackSingle(
    params: { action: string },
    result: JobRead & { managerId: number }
  ) {
    const { id: jobId, ...rest } = result;
    const auditJob = {
      action: params.action.toUpperCase(),
      jobId,
      ...rest,
    };
    await db.auditJob.create({ data: auditJob });
  }

  private async trackUpdateMany(params: {
    action: string;
    args: Prisma.JobUpdateArgs;
  }) {
    const updatedJobs = await db.job.findMany({
      where: params.args.where,
    });
    updatedJobs.forEach(async (job) => {
      const { id: jobId, ...rest } = job;
      const auditJob = {
        action: params.action.toUpperCase(),
        jobId,
        ...rest,
      };
      await db.auditJob.create({ data: auditJob });
    });
  }
}

export default new JobsRepository();
