import {
  CrewForJobRead,
  JobRead,
  JobWithDetails,
} from '../jobs/jobs.repository';
import { db } from '../utils/db.server';

export type EmployeeRead = {
  id: number;
  firstName: string | null;
  lastName: string | null;
};

export type EmployeeWrite = {
  firstName: string;
  lastName: string;
};

type EmployeeWithDetails = EmployeeRead & {
  jobs: {
    managed: Array<JobWithDetails>;
    crewed: Array<JobWithDetails>;
  };
};

export class EmployeesRepository {
  async getAllEmployees(): Promise<Array<EmployeeRead>> {
    return await db.employee.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  async getEmployeeById(id: number): Promise<EmployeeWithDetails> {
    return await db.employee
      .findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          CrewForJob: {
            select: {
              employee: true,
              job: true,
            },
          },
          Job: true,
        },
      })
      .then((employee) => this.formatDetailedEmployee(employee));
  }

  async createEmployee(data: EmployeeWrite): Promise<EmployeeRead> {
    return await db.employee.create({
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  async updateEmployee(id: number, data: EmployeeWrite): Promise<EmployeeRead> {
    return await db.employee.update({
      where: { id },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  async partialUpdateEmployee(
    id: number,
    data: Partial<EmployeeWrite>
  ): Promise<EmployeeRead> {
    return await db.employee.update({
      where: { id },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  async deleteEmployee(id: number): Promise<EmployeeRead> {
    return await db.employee.delete({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  private formatDetailedEmployee(employee: any): EmployeeWithDetails {
    return {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      jobs: {
        managed: employee.Job.map((job: JobRead) => ({
          ...job,
        })),
        crewed: employee.CrewForJob.map(({ job }: { job: CrewForJobRead }) => ({
          ...job,
        })),
      },
    };
  }
}

export default new EmployeesRepository();
