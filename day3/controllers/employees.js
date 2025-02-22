import fs from 'node:fs';
import {FILE_PATH} from '../index.js';

export const getEmployees = (req, res) => {
  const query = req.query;
  try {
    let employees = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    employees = employees.filter((emp) => {
      for (const [k, v] of Object.entries(query)) {
        if (emp[k] !== v) return false;
      }
      return true;
    });
    res.status(200).json({status: 'success', data: employees});
  } catch (err) {
    res.status(500).json({status: 'fail', message: err.message});
  }
};

export const getEmployee = (req, res) => {
  const id = req.params.id;
  try {
    const employees = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    const emp = employees.find((emp) => emp.id === +id);
    if (emp) return res.status(200).json({status: 'success', data: emp});
    else return res.status(404).json({status: 'fail', message: 'Employee not found'});
  } catch (err) {
    res.status(500).json({status: 'fail', message: err.message});
  }
};

export const insertEmployee = (req, res) => {
  try {
    const employees = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    const lastID = employees.at(-1).id || 0;
    const employee = {id: lastID + 1, level: 'Jr', yearsOfExperience: 0, ...req.body};
    employees.push(employee);
    fs.writeFileSync(FILE_PATH, JSON.stringify(employees));
    res.status(201).json({status: 'success', data: employee});
  } catch (err) {
    res.status(500).json({status: 'fail', message: err.message});
  }
};

export const updateEmployee = (req, res) => {
  const id = req.params.id;
  try {
    const employees = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    const employeeIndex = employees.findIndex((emp) => emp.id === +id);
    if (employeeIndex === -1) return res.status(404).json({status: 'fail', message: 'Employee not found'});
    const updateEmployee = {...employees[employeeIndex], ...req.body};
    employees[employeeIndex] = updateEmployee;
    fs.writeFileSync(FILE_PATH, JSON.stringify(employees));
    return res.status(200).json({status: 'success', data: employees[employeeIndex]});
  } catch (err) {
    res.status(500).json({status: 'fail', message: err.message});
  }
};

export const deleteEmployee = (req, res) => {
  const id = req.params.id;
  try {
    let employees = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    employees = employees.filter((emp) => emp.id !== +id);
    fs.writeFileSync(FILE_PATH, JSON.stringify(employees));
    res.status(204).json({status: 'success'});
  } catch (err) {
    res.status(500).json({status: 'fail', message: err.message});
  }
};
