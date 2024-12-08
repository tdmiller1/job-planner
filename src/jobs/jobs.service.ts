import assert from 'assert';
import { JobsRepository } from './jobs.repository';

/**
 * Service for managing jobs.
 */
export class JobsService {
  private jobsRepository: JobsRepository;

  /**
   * Creates an instance of JobsService.
   * @param jobsRepository - The repository to manage job data.
   */
  constructor(jobsRepository: any) {
    this.jobsRepository = jobsRepository;
  }

  /**
   * Retrieves all jobs.
   * @returns An array of all jobs.
   */
  getJobs() {
    return this.jobsRepository.getAllJobs();
  }

  /**
   * Retrieves a job by its ID.
   * @param id - The ID of the job to retrieve.
   * @returns The job with the given ID.
   */
  getJobById(id: number) {
    this.validateId(id);
    return this.jobsRepository.getJobById(id);
  }

  /**
   * Creates a new job.
   * @param data - The job data to create.
   * @param data.managerId - The ID of the manager.
   * @param data.name - The name of the job.
   * @param data.draftingHours - The number of drafting hours required.
   * @param data.orderedDate - The date the job was ordered (ISO-8601 format).
   * @param data.notes - Additional notes about the job (optional).
   * @throws Error if any required fields are missing or if orderedDate is not a valid ISO-8601 date time string.
   * @returns The created job.
   */
  createJob(data: {
    managerId: number;
    name: string;
    draftingHours: number;
    orderedDate: string;
    notes?: string;
  }) {
    this.validateFullJob(data);

    return this.jobsRepository.createJob(data);
  }

  /**
   * Updates an existing job.
   * @param id - The ID of the job to update.
   * @param data - The job data to update.
   * @param data.managerId - The ID of the manager.
   * @param data.name - The name of the job.
   * @param data.draftingHours - The number of drafting hours required.
   * @param data.orderedDate - The date the job was ordered (ISO-8601 format).
   * @param data.notes - Additional notes about the job (optional).
   * @returns The updated job.
   */
  updateJob(
    id: number,
    data: {
      managerId: number;
      name: string;
      draftingHours: number;
      orderedDate: string;
      notes?: string;
    }
  ) {
    this.validateId(id);
    this.validateFullJob(data);

    return this.jobsRepository.updateJob(id, data);
  }

  /**
   * Partially updates an existing job.
   * @param id - The ID of the job to update.
   * @param data - The partial job data to update.
   * @param data.managerId - The ID of the manager (optional).
   * @param data.name - The name of the job (optional).
   * @param data.draftingHours - The number of drafting hours required (optional).
   * @param data.orderedDate - The date the job was ordered (ISO-8601 format) (optional).
   * @param data.notes - Additional notes about the job (optional).
   * @returns The updated job.
   */
  partialUpdateJob(
    id: number,
    data: {
      managerId?: number;
      name?: string;
      draftingHours?: number;
      orderedDate?: string;
      notes?: string;
    }
  ) {
    this.validateId(id);
    this.validatePartialJob(data);

    return this.jobsRepository.partialUpdateJob(id, data);
  }

  /**
   * Deletes a job by its ID.
   * @param id - The ID of the job to delete.
   * @returns The deleted job.
   */
  deleteJob(id: number) {
    this.validateId(id);
    return this.jobsRepository.deleteJob(id);
  }

  /**
   * Validates the ID of a job.
   * @param id - The ID to validate.
   * @throws Error if the ID is not a positive number.
   */
  private validateId(id: number) {
    assert.ok(id > 0, 'ID must be a positive number');
  }

  /**
   * Validates the full job data.
   * @param data - The job data to validate.
   * @param data.managerId - The ID of the manager.
   * @param data.name - The name of the job.
   * @param data.draftingHours - The number of drafting hours required.
   * @param data.orderedDate - The date the job was ordered (ISO-8601 format).
   * @param data.notes - Additional notes about the job (optional).
   * @throws Error if any required fields are missing or if orderedDate is not a valid ISO-8601 date time string.
   */
  private validateFullJob(data: {
    managerId: number;
    name: string;
    draftingHours: number;
    orderedDate: string;
    notes?: string;
  }) {
    assert.ok(data.managerId, 'Manager ID is required');
    assert.ok(data.name, 'Name is required');
    assert.ok(data.draftingHours, 'Drafting hours are required');
    assert.ok(data.orderedDate, 'Ordered date is required');
    assert.ok(
      new Date(data.orderedDate).toISOString() === data.orderedDate,
      'Ordered date must be a valid ISO-8601 date time string'
    );
  }

  /**
   * Validates the partial job data.
   * @param data - The partial job data to validate.
   * @param data.managerId - The ID of the manager (optional).
   * @param data.name - The name of the job (optional).
   * @param data.draftingHours - The number of drafting hours required (optional).
   * @param data.orderedDate - The date the job was ordered (ISO-8601 format) (optional).
   * @param data.notes - Additional notes about the job (optional).
   * @throws Error if any provided fields are invalid.
   */
  private validatePartialJob(data: {
    managerId?: number;
    name?: string;
    draftingHours?: number;
    orderedDate?: string;
    notes?: string;
  }) {
    console.log(`ValdiatePartialJob: ${JSON.stringify(data)}`);
    if (data.managerId !== undefined) {
      assert.ok(
        typeof data.managerId === 'number',
        'Manager ID must be a number'
      );
    }
    if (data.name !== undefined) {
      assert.ok(typeof data.name === 'string', 'Name must be a string');
    }
    if (data.draftingHours !== undefined) {
      assert.ok(
        typeof data.draftingHours === 'number',
        'Drafting hours must be a number'
      );
    }
    if (data.orderedDate !== undefined) {
      assert.ok(
        new Date(data.orderedDate).toISOString() === data.orderedDate,
        'Ordered date must be a valid ISO-8601 date time string'
      );
    }

    assert.ok(
      data.managerId !== undefined ||
        data.name !== undefined ||
        data.draftingHours !== undefined ||
        data.orderedDate !== undefined ||
        data.notes !== undefined,
      'At least one field must be provided'
    );
  }
}
