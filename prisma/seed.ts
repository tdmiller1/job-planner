import { db } from '../src/utils/db.server';

type MlsSeedStructure = {
  jobs: Array<{
    name: string;
    draftingHours: number;
    orderedDate: Date;
    notes: string;
    manager: {
      firstName: string;
      lastName: string;
    };
    crew: Array<{
      firstName: string;
      lastName: string;
    }>;
  }>;
  employees: Array<{
    firstName: string;
    lastName: string;
  }>;
};

const MLS_SEED_DATA: MlsSeedStructure = {
  jobs: [
    {
      name: 'Monroe 5',
      draftingHours: 5,
      orderedDate: new Date('2024-10-02'),
      notes: '',
      manager: {
        firstName: 'Jobey',
        lastName: '',
      },
      crew: [
        {
          firstName: 'Andy',
          lastName: 'Jackson',
        },
      ],
    },
    {
      name: "Ostrowski's",
      draftingHours: 5,
      orderedDate: new Date('2024-11-13'),
      notes: '',
      manager: {
        firstName: 'Jordan',
        lastName: 'Miller',
      },
      crew: [],
    },
    {
      name: 'Lancaster 20',
      draftingHours: 4,
      orderedDate: new Date('2024-07-09'),
      notes: '',
      manager: {
        firstName: 'Brett',
        lastName: 'Miller',
      },
      crew: [
        {
          firstName: 'Andy',
          lastName: 'Wolf',
        },
      ],
    },
    {
      name: 'Perry 18',
      draftingHours: 6,
      orderedDate: new Date('2024-11-06'),
      notes: '',
      manager: {
        firstName: 'Ben',
        lastName: 'Johnson',
      },
      crew: [
        {
          firstName: 'Kyle',
          lastName: 'Roach',
        },
      ],
    },
    {
      name: 'Wayne 14',
      draftingHours: 14,
      orderedDate: new Date('2024-11-06'),
      notes: '',
      manager: {
        firstName: 'Ben',
        lastName: 'Johnson',
      },
      crew: [
        {
          firstName: 'Josh',
          lastName: '',
        },
        {
          firstName: 'Andy',
          lastName: 'Jackson',
        },
      ],
    },
  ],
  // Extras must not included in jobs above
  employees: [
    {
      firstName: 'Josh',
      lastName: '',
    },
    {
      firstName: 'Tyler',
      lastName: 'Roach',
    },
  ],
};

seed();

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
      try {
        console.log('Creating job, employee, and crewforjob', job);

        // Create Manager
        const manager = await rootTx.employee.create({
          data: {
            ...job.manager,
          },
        });
        console.log('Manager created', manager);

        // Create employees out of job.crew
        const crew: Array<{
          id: number;
          firstName: string | null;
          lastName: string | null;
        }> = [];
        for (const crewMember of job.crew) {
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
        }

        // Create Job
        const newJob = await rootTx.job.create({
          data: {
            name: job.name,
            draftingHours: job.draftingHours,
            orderedDate: job.orderedDate,
            notes: job.notes,
            managerId: manager.id,
          },
        });

        // Create CrewForJob
        let crewForJobId: number;
        for (const employee of crew) {
          const crewForJob = await rootTx.crewForJob.create({
            data: {
              employeeId: employee.id,
              jobId: newJob.id,
            },
          });
          crewForJobId = crewForJob.id;
        }

        console.log('Job, employee, and crewforjob created', job);
      } catch (error) {
        throw error;
      }
    }
  });
}
