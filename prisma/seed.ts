import { db } from '../src/utils/db.server';
import { MLS_SEED_DATA } from './csvToSeed';
import { JobsRepository } from '../src/jobs/jobs.repository';
import { JobStatus } from '@prisma/client';

export type MlsSeedStructure = {
  jobs: Array<{
    name: string;
    status: JobStatus;
    draftingHours: number;
    orderedDate: Date | string;
    notes: string;
    manager: {
      firstName: string;
      lastName: string;
    };
    crew: Array<{
      firstName: string;
      lastName: string;
    }>;
  } | null>;
  employees: Array<{
    firstName: string;
    lastName: string;
  }>;
};

seed();

const jobsRepository = new JobsRepository();

async function seed() {
  // Entire Seed is run in transaction
  await db.$transaction(async (rootTx) => {
    for (const employee of MLS_SEED_DATA.employees) {
      try {
        console.log('Creating employee', employee);
        await rootTx.employee.create({
          data: {
            ...employee,
          },
        });
        console.log('Employee created', employee);
      } catch (error) {
        console.error('Error creating employee', employee, error);
        throw error;
      }
    }

    for (const job of MLS_SEED_DATA.jobs) {
      if (!job) {
        continue;
      }
      try {
        console.log('Creating job, employee, and crewforjob', job);

        // Find or create employee based on first and last name
        let manager = await rootTx.employee.findFirst({
          where: {
            firstName: job.manager?.firstName,
            lastName: job.manager?.lastName,
          },
        });

        // Create Manager
        if (!manager) {
          manager = await rootTx.employee.create({
            data: {
              ...job.manager,
            },
          });
          console.log('Manager created', manager);
        }
        // Create employees out of job.crew
        const crew: Array<{
          id: number;
          firstName: string | null;
          lastName: string | null;
        }> = [];

        await Promise.all(
          job.crew.map(async (crewMember) => {
            // Find or create employee based on first and last name
            let employee = await rootTx.employee.findFirst({
              where: {
                firstName: crewMember.firstName,
                lastName: crewMember.lastName,
              },
            });

            if (!employee) {
              employee = await rootTx.employee.create({
                data: {
                  ...crewMember,
                },
              });
            }

            crew.push(employee);
          })
        );

        const randomlySelectedStatus = Object.keys(JobStatus)[
          Math.floor(Math.random() * Object.keys(JobStatus).length)
        ] as JobStatus;

        // Create Job
        const newJob = await rootTx.job.create({
          data: {
            name: job.name || '',
            draftingHours: job.draftingHours,
            orderedDate: job.orderedDate,
            status: JobStatus[randomlySelectedStatus],
            notes: job.notes || '',
            managerId: manager.id,
          },
        });

        jobsRepository.enableAuditTracking({ action: 'create' }, newJob);

        // Create CrewForJob
        await Promise.all(
          crew.map(async (employee) => {
            await rootTx.crewForJob.create({
              data: {
                employeeId: employee.id,
                jobId: newJob.id,
              },
            });
          })
        );
        console.log('Job, employee, and crewforjob created', job);
      } catch (error) {
        throw error;
      }
    }
  });
}
