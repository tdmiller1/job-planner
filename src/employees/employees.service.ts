import assert from 'assert';
import { EmployeesRepository, EmployeeWrite } from './employees.repository';

class EmployeeServiceError extends Error {
  private status: number = 500;

  constructor({ message, status }: { message: string; status?: number }) {
    super();
    this.name = 'EmployeeServiceError';
    this.message = message;
    this.status = status || this.status;
  }
}

/**
 * Service for managing employees.
 */
export class EmployeesService {
  private employeesRepository: EmployeesRepository;

  /**
   * Creates an instance of employeesService.
   * @param employeesRepository - The repository to manage employee data.
   */
  constructor(employeesRepository: any) {
    this.employeesRepository = employeesRepository;
  }

  /**
   * Retrieves all employees.
   * @returns All employees.
   */
  getAllEmployees() {
    return this.employeesRepository.getAllEmployees();
  }

  /**
   * Retrieves a employee by its ID.
   * @param id - The ID of the employee to retrieve.
   * @returns The employee with the given ID.
   */
  async getEmployeeById(id: number) {
    this.validateId(id);
    return this.getEmployeeByIdFromRepository(id);
  }

  /**
   * Creates a new employee.
   * @param data - The employee data to create.
   * @param data.firstName - The first name of the employee.
   * @param data.lastName - The last name of the employee.
   * @throws Error if any required fields are missing.
   * @returns The created employee.
   */
  createEmployee(data: EmployeeWrite) {
    this.validateFullEmployee(data);
    return this.employeesRepository.createEmployee(data);
  }

  /**
   * Updates an existing employee.
   * @param id - The ID of the employee to update.
   * @param data.firstName - The first name of the employee.
   * @param data.lastName - The last name of the employee.
   * @throws Error if any required fields are missing.
   * @returns The updated employee.
   */
  async updateEmployee(id: number, data: EmployeeWrite) {
    await this.validateEmployeeById(id);
    this.validateFullEmployee(data);
    return this.employeesRepository.updateEmployee(id, data);
  }

  /**
   * Partially updates an existing employee.
   * @param id - The ID of the employee to update.
   * @param data.firstName - The first name of the employee. (optional)
   * @param data.lastName - The last name of the employee. (optional)
   * @returns The updated employee.
   */
  async partialUpdateEmployee(id: number, data: Partial<EmployeeWrite>) {
    await this.validateEmployeeById(id);
    this.validatePartialEmployee(data);
    return this.employeesRepository.partialUpdateEmployee(id, data);
  }

  /**
   * Deletes a employee.
   * @param id - The ID of the employee to delete.
   * @returns The deleted employee.
   * @throws Error if the ID is not a positive number.
   */
  async deleteEmployee(id: number) {
    await this.validateEmployeeById(id);
    return this.employeesRepository.deleteEmployee(id);
  }

  /**
   * Validates the ID of a employee.
   * @param id - The ID to validate.
   * @throws Error if the ID is not a positive number.
   */
  private validateId(id: number) {
    assert.ok(id > 0, 'ID must be a positive number');
  }

  /**
   * Validates the ID of a employee and checks if the employee exists.
   * @param id - The ID to validate.
   * @throws Error if the ID is not a positive number or if the employee does not exist.
   */
  private async validateEmployeeById(id: number) {
    this.validateId(id);
    await this.getEmployeeById(id).catch((e) => {
      console.log('MESSAGE', e.message);
      if (e.message.includes('Expected a record, found none.')) {
        throw new EmployeeServiceError({
          message: `Employee with ID ${id} not found`,
          status: 404,
        });
      }
    });
  }

  /**
   * Retrieves a employee by its ID from the repository.
   * @param id - The ID of the employee to retrieve.
   * @returns The employee with the given ID.
   */
  private getEmployeeByIdFromRepository(id: number) {
    return this.employeesRepository.getEmployeeById(id).catch((e) => {
      console.log('MESSAGE', e.message);
      if (e.message.includes('Expected a record, found none.')) {
        throw new EmployeeServiceError({
          message: `Employee with ID ${id} not found`,
          status: 404,
        });
      }
    });
  }

  /**
   * Validates the full employee data.
   * @param data - The employee data to validate.
   * @param data.firstName - The ID of the manager.
   * @param data.lastName - The name of the job.
   * @throws Error if any required fields are missing
   */
  private validateFullEmployee(data: { firstName: string; lastName: string }) {
    assert.ok(data.firstName, 'First name is required');
    assert.ok(data.lastName, 'Last name is required');
  }

  /**
   * Validates the partial employee data.
   * @param data - The employee data to validate.
   * @param data.firstName - The ID of the manager.
   * @param data.lastName - The name of the job.
   * @throws Error if any required fields are missing
   */
  private validatePartialEmployee(data: {
    firstName?: string;
    lastName?: string;
  }) {
    if (data.firstName !== undefined) {
      assert.ok(
        typeof data.firstName === 'string',
        'First name must be a string'
      );
    }
    if (data.lastName !== undefined) {
      assert.ok(
        typeof data.lastName === 'string',
        'Last name must be a string'
      );
    }
    assert.ok(
      data.firstName !== undefined ||
        data.lastName !== undefined ||
        'At least one field must be provided'
    );
  }
}
