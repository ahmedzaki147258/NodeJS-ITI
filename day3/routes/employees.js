import express from 'express';
import {deleteEmployee, getEmployee, getEmployees, insertEmployee, updateEmployee} from '../controllers/employees.js';
import {validateCreate, validateUpdate} from '../validations/employees.js';

const Router = express.Router();

Router.get('/', getEmployees);
Router.get('/:id', getEmployee);
Router.post('/', validateCreate, insertEmployee);
Router.patch('/:id', validateUpdate, updateEmployee);
Router.delete('/:id', deleteEmployee);

export default Router;
