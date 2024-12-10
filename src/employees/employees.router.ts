import { Router } from 'express';
import { EmployeesService } from './employees.service';
import employeesRepository from './employees.repository';

export const employeesRouter = Router();

// Get all employees
employeesRouter.get('/', async (req, res, next) => {
  const employeesService = new EmployeesService(employeesRepository);
  employeesService
    .getAllEmployees()
    .then((employees) => res.status(200).json({ employees }))
    .catch(next);
});

// Get employee by id
employeesRouter.get('/:id', async (req, res, next) => {
  const employeesService = new EmployeesService(employeesRepository);
  employeesService
    .getEmployeeById(parseInt(req.params.id, 10))
    .then((employee) => res.status(200).json({ ...employee }))
    .catch(next);
});

// Create employee
employeesRouter.post('/', async (req, res, next) => {
  const employeesService = new EmployeesService(employeesRepository);
  employeesService
    .createEmployee(req.body)
    .then((employee) => res.status(201).json({ ...employee }))
    .catch(next);
});

// Update employee
employeesRouter.put('/:id', async (req, res, next) => {
  const employeesService = new EmployeesService(employeesRepository);

  employeesService
    .updateEmployee(parseInt(req.params.id, 10), req.body)
    .then((employee) => res.status(200).json({ ...employee }))
    .catch(next);
});

// Partially update employee
employeesRouter.patch('/:id', async (req, res, next) => {
  const employeesService = new EmployeesService(employeesRepository);

  employeesService
    .partialUpdateEmployee(parseInt(req.params.id, 10), req.body)
    .then((employee) => res.status(200).json({ ...employee }))
    .catch(next);
});

// Delete employee
employeesRouter.delete('/:id', async (req, res, next) => {
  const employeesService = new EmployeesService(employeesRepository);

  employeesService
    .deleteEmployee(parseInt(req.params.id, 10))
    .then(() => res.status(204).end())
    .catch(next);
});
