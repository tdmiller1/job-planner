// Convert CSV Project data to the MLS_SEED_DATA object
// CSV data is in the format:
// managerFirstName,managerLastName,projectName,orderedDate,draftingHours,county,dueDate,orderedBy,surveyType,crewFirstName,crewLastName,notes,oldSurveyRes,researchComplete,filePrep,filePlacedOnTeams,fieldWorkComplete,fieldHours

// CSV data needs mapped to the MLS_SEED_DATA object format:
// {
//   jobs: [
//     {
//       name: projectName,
//       draftingHours: draftingHours,
//       orderedDate: new Date(orderedDate),
//       notes: notes,
//       manager: {
//         firstName: managerFirstName,
//         lastName: managerLastName,
//       },
//       crew: [
//         {
//           firstName: crewFirstName,
//           lastName: crewLastName,
//         },
//       ],
//     },
//   ],
// }

import fs from 'fs';
import path from 'path';
import { MlsSeedStructure } from './seed';

const CSV_FILE_PATH = path.resolve(__dirname, '../data/projects.csv');
const CSV_FILE_ENCODING = 'utf8';

const csvData = fs.readFileSync(CSV_FILE_PATH, CSV_FILE_ENCODING);
const csvLines = csvData.split('\n');

const MLS_SEED_DATA: MlsSeedStructure = {
  jobs: csvLines.map((line) => {
    const [
      managerFirstName,
      managerLastName,
      projectName,
      orderedDate,
      draftingHours,
      county,
      dueDate,
      orderedBy,
      surveyType,
      crewFirstName,
      crewLastName,
      notes,
      oldSurveyRes,
      researchComplete,
      filePrep,
      filePlacedOnTeams,
      fieldWorkComplete,
      fieldHours,
    ] = line.split(',');

    const hasCrew =
      crewFirstName ||
      (crewLastName && crewFirstName !== 'N/A' && crewLastName !== 'N/A');

    if (!projectName) {
      console.log('Project name is missing');
      return null;
    }

    return {
      name: projectName?.trim(),
      draftingHours: Number(draftingHours) || 0,
      orderedDate: !isNaN(Date.parse(orderedDate))
        ? new Date(orderedDate)
        : new Date(),
      notes: notes?.trim() || '',
      manager: {
        firstName: managerFirstName?.trim() || '',
        lastName: managerLastName?.trim() || '',
      },
      crew: hasCrew
        ? [
            {
              firstName: crewFirstName?.trim(),
              lastName: crewLastName?.trim(),
            },
          ]
        : [],
    };
  }),
  employees: [],
};

console.log(JSON.stringify(MLS_SEED_DATA, null, 2));

// Output:
export { MLS_SEED_DATA };
