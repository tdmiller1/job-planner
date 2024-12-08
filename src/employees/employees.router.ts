import { Router } from 'express';
import { EmployeesService } from './employees.service';
import employeesRepository from './employees.repository';

export const employeesRouter = Router();

// Get all employees
employeesRouter.get('/', async (req, res) => {
  const employeesService = new EmployeesService(employeesRepository);
  try {
    res.json(await employeesService.getAllEmployees());
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get employee by id
employeesRouter.get('/:id', async (req, res) => {
  const employeesService = new EmployeesService(employeesRepository);
  try {
    res.json(
      await employeesService.getEmployeeById(parseInt(req.params.id, 10))
    );
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Create employee
employeesRouter.post('/', async (req, res) => {
  const employeesService = new EmployeesService(employeesRepository);
  try {
    res.json(await employeesService.createEmployee(req.body));
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Update employee
employeesRouter.put('/:id', async (req, res) => {
  const employeesService = new EmployeesService(employeesRepository);
  try {
    res.json(
      await employeesService.updateEmployee(
        parseInt(req.params.id, 10),
        req.body
      )
    );
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Partially update employee
employeesRouter.patch('/:id', async (req, res) => {
  const employeesService = new EmployeesService(employeesRepository);
  try {
    res.json(
      await employeesService.partialUpdateEmployee(
        parseInt(req.params.id, 10),
        req.body
      )
    );
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete employee
employeesRouter.delete('/:id', async (req, res) => {
  const employeesService = new EmployeesService(employeesRepository);
  try {
    res.json(
      await employeesService.deleteEmployee(parseInt(req.params.id, 10))
    );
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
