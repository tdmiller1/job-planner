import { Prisma } from '@prisma/client';

export abstract class BaseRepository<T, J> {
  abstract getAllJobs(where?: Prisma.JobWhereInput): Promise<T[]>;

  async getJobById(id: number): Promise<T> {
    return {} as T;
  }

  async createJob(data: J): Promise<T> {
    return {} as T;
  }

  async updateJob(id: number, data: J): Promise<T> {
    return {} as T;
  }

  async partialUpdateJob(id: number, data: Partial<J>): Promise<T> {
    return {} as T;
  }

  async deleteJob(id: number): Promise<T> {
    return {} as T;
  }
}
