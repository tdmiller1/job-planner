import { db } from '../src/utils/db.server';

type Employee = {
  // id: number;
  firstName: string;
  lastName: string;
};

type Job = {
  // id: number;
  name: string;
  draftingHours: number;
  orderedDate: Date;
  notes: string;
  manager: string;
  crewName: string;
};

// authorSeeds();

seedMLS();

function getEmployees(): Array<Employee> {
  return [
    {
      // id: 1,
      firstName: 'Jobey',
      lastName: '',
    },
    {
      // id: 2,
      firstName: 'Jordan',
      lastName: 'Miller',
    },
    {
      // id: 3,
      firstName: 'Brett',
      lastName: 'Miller',
    },
    {
      // id: 4,
      firstName: 'Ben',
      lastName: 'Johnson',
    },
    {
      // id: 5,
      firstName: 'Andy',
      lastName: 'Jackson',
    },
    {
      // id: 6,
      firstName: 'Josh',
      lastName: '',
    },
    {
      // id: 7,
      firstName: 'Tyler',
      lastName: 'Roach',
    },
    {
      // id: 8,
      firstName: 'Kyle',
      lastName: 'Roach',
    },
    {
      // id: 9,
      firstName: 'Andy W',
      lastName: 'Wolf',
    },
  ];
}

function getJobs(): Array<Job> {
  return [
    {
      // id: 1,
      name: 'Monroe 5',
      draftingHours: 5,
      orderedDate: new Date('2024-10-02'),
      notes: '',
      manager: 'Jobey',
      crewName: 'Andy',
    },
    {
      // id: 2,
      name: "Ostrowski's",
      draftingHours: 5,
      orderedDate: new Date('2024-11-13'),
      notes: '',
      manager: 'Jordan',
      crewName: '',
    },
    {
      // id: 3,
      name: 'Lancaster 20',
      draftingHours: 4,
      orderedDate: new Date('2024-07-09'),
      notes: '',
      manager: 'Brett',
      crewName: 'Josh',
    },
    {
      // id: 4,
      name: 'Perry 18',
      draftingHours: 6,
      orderedDate: new Date('2024-11-06'),
      notes: '',
      manager: 'Ben',
      crewName: 'Kyle',
    },
  ];
}

function getCrews() {
  return [
    {
      firstName: 'Andy',
      name: 'Monroe 5',
    },
    {
      firstName: 'Josh',
      name: 'Lancaster 20',
    },
    {
      firstName: 'Kyle',
      name: 'Perry 18',
    },
  ];
}

async function seedMLS() {
  // Employees first, then crew, then Jobs
  await Promise.all(
    getEmployees().map(async (author) => {
      const existing = await db.employee.findFirst({
        where: { firstName: author.firstName },
      });
      if (existing !== null) {
        console.log(`Existing record for ${author.firstName}`);
      }
      return db.employee.create({
        data: {
          ...author,
        },
      });
    })
  );

  await Promise.all(
    getCrews().map(async (crews) => {
      // const job = await db.job.findFirst({
      //   where: { name: crews.name },
      //   select: {
      //     id: true,
      //   },
      // });
      // if (job?.id === undefined) {
      //   console.log("couldn't find job", crews.name);
      //   return;
      // }
      const employee = await db.employee.findFirst({
        where: {
          firstName: crews.firstName,
        },
        select: { id: true },
      });
      if (employee?.id === undefined) {
        console.log("couldn't find employee", crews.firstName);
        return;
      }
      const crew = {
        // jobId: job.id,
        employeeId: employee.id,
      };
      const crewsss = await db.crewForJob.findFirst({
        where: {
          employeeId: employee.id,
        },
        select: { id: true },
      });
      if (crewsss?.id === undefined) {
        console.log('Existing record for Crew employee', employee?.id);
        return;
      }
      return db.crewForJob.create({
        data: {
          ...crew,
        },
      });
    })
  );

  await Promise.all(
    getJobs().map(async (job) => {
      const manager = await db.employee.findFirst({
        where: { firstName: job.manager },
        select: { id: true },
      });
      if (manager?.id === undefined) {
        console.log('manager not found', job.manager);
        return;
      }
      const crewEmployee = await db.employee.findFirst({
        where: { firstName: job.crewName },
        select: { id: true },
      });
      let crewId;
      if (crewEmployee !== null) {
        if (crewEmployee?.id === undefined) {
          console.log('crewEmployee not found', job.crewName);
          return;
        }
        const crew = await db.crewForJob.findFirst({
          where: { employeeId: crewEmployee.id },
          select: { id: true },
        });
        if (crew?.id === undefined) {
          console.log('crew not found', crewEmployee.id);
          return;
        }
        const existing = await db.job.findFirst({
          where: { name: job.name },
        });
        if (existing !== null) {
          console.log(`Existing record for ${existing.name}`);
        }
        crewId = crew.id;
      }
      return db.job.create({
        data: {
          name: job.name,
          draftingHours: job.draftingHours,
          orderedDate: job.orderedDate,
          notes: job.notes,
          managerId: manager.id,
          crewId,
        },
      });
    })
  );

  // Now set their jobs
  await Promise.all(
    getCrews().map(async (crews) => {
      const job = await db.job.findFirst({
        where: { name: crews.name },
        select: {
          id: true,
        },
      });
      if (job?.id === undefined) {
        console.log("couldn't find job", crews.name);
        return;
      }
      const employee = await db.employee.findFirst({
        where: {
          firstName: crews.firstName,
        },
        select: { id: true },
      });
      if (employee?.id === undefined) {
        console.log("couldn't find employee", crews.firstName);
        return;
      }
      const crewsss = await db.crewForJob.findFirst({
        where: {
          employeeId: employee.id,
        },
        select: { id: true },
      });
      if (crewsss?.id === undefined) {
        console.log("couldn't find crewsss", employee?.id);
        return;
      }
      const crew = {
        jobId: job.id,
        employeeId: employee.id,
      };
      return db.crewForJob.update({
        where: {
          id: crewsss.id,
        },
        data: {
          ...crew,
        },
      });
    })
  );
}

type Author = {
  firstName: string;
  lastName: string;
};

type Book = {
  title: string;
  isFiction: boolean;
  datePublished: Date;
};

async function authorSeeds() {
  await Promise.all(
    getEmployees().map((author) =>
      db.employee.create({
        data: {
          ...author,
        },
      })
    )
  );
  // await Promise.all(
  //   getAuthors().map((author) =>
  //     db.employee.create({
  //       data: {
  //         ...author,
  //       },
  //     })
  //   )
  // );
  // const author = await db.author.findFirst({
  //   where: {
  //     firstName: "Yuval Noah",
  //   },
  // });

  // if (author?.id !== undefined) {
  //   await Promise.all(
  //     getBooks().map((book) =>
  //       db.book.create({
  //         data: {
  //           ...book,
  //           authorId: author?.id,
  //         },
  //       })
  //     )
  //   );
  // }
}

function getAuthors(): Array<Author> {
  return [
    {
      firstName: 'John',
      lastName: 'Doe',
    },
    {
      firstName: 'William',
      lastName: 'Shakespeare',
    },
    {
      firstName: 'Yuval Noah',
      lastName: 'Harari',
    },
  ];
}

function getBooks(): Array<Book> {
  return [
    {
      title: 'Sapiens',
      isFiction: false,
      datePublished: new Date(),
    },
    {
      title: 'Homo Deus',
      isFiction: false,
      datePublished: new Date(),
    },
    {
      title: 'The Ugly Duckling',
      isFiction: true,
      datePublished: new Date(),
    },
  ];
}
