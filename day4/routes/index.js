import express from 'express';
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getOneEmployee,
  loginEmployee,
  updateEmployee,
  updateEmployeeProfile
} from '../controllers/employeeController.js';
import {createLeave, getAllLeaves, getLeavesByEmployee, updateLeave} from '../controllers/leaveController.js';
import {authenticate} from '../middlewares/authorization.js';

const Router = express.Router();

Router.post('/employees/login', loginEmployee);
Router.post('/employees', createEmployee);

Router.get('/employee', authenticate, getOneEmployee);
Router.get('/employees', getAllEmployees);
Router.patch('/employees/:id', authenticate, updateEmployee);
Router.delete('/employees/:id', authenticate, deleteEmployee);
Router.patch('/employeeProfile/:id', authenticate, updateEmployeeProfile);

Router.post('/leave', authenticate, createLeave);
Router.patch('/leave/:id', authenticate, updateLeave);
Router.get('/employees/:id/leaves', authenticate, getLeavesByEmployee);
Router.get('/leaves', getAllLeaves);

Router.all('*', (req, res) => res.status(404).json({status: 'fail', message: 'Route not found'}));
export default Router;
