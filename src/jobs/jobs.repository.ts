import { db } from '../utils/db.server';

type JobRead = {
  id: number;
  name: string;
  updatedAt: Date;
  draftingHours: number;
};

type EmployeeRead = {
  id: number;
  firstName: string | null;
  lastName: string | null;
};

type JobWithDetails = JobRead & {
  Manager: EmployeeRead;
  CrewForJob: Array<{
    employee: EmployeeRead;
  }>;
};

type JobWrite = {
  managerId: number;
  name: string;
  draftingHours: number;
  orderedDate: string;
  notes?: string;
};

export class JobsRepository {
  async getAllJobs(): Promise<Array<JobWithDetails>> {
    return await db.job.findMany({
      select: {
        id: true,
        name: true,
        updatedAt: true,
        draftingHours: true,
        Manager: true,
        CrewForJob: {
          select: {
            employee: true,
          },
        },
      },
    });
  }

  async getJobById(id: number): Promise<JobRead> {
    return await db.job.findUniqueOrThrow({
      where: { id },
    });
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
}

export default new JobsRepository();
