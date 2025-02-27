import process from 'node:process';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  createEmployeeValidation,
  updateEmployeeProfileValidation,
  updateEmployeeValidation
} from '../middlewares/validations.js';
import Employee from '../models/employeeSchema.js';
import Leave from '../models/leaveSchema.js';

export const loginEmployee = async (req, res) => {
  try {
    const {username, password} = req.body;
    console.log(username, password);
    const employee = await Employee.findOne({username});
    if (!employee) return res.status(401).json({status: 'fail', message: 'Incorrect data'});
    const isPasswordMatch = await bcrypt.compare(password, employee.password);
    if (!isPasswordMatch) return res.status(401).json({status: 'fail', message: 'Incorrect data'});
    const token = jwt.sign({_id: employee._id}, process.env.JWT_SECRET);
    res.status(200).json({status: 'success', token});
  } catch (err) {
    res.status(400).json({status: 'fail', message: err.message});
  }
};

export const getOneEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.empId).lean();
    res.status(200).json({status: 'success', data: employee});
  } catch (err) {
    res.status(400).json({status: 'fail', message: err.message});
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({status: 'success', data: employees});
  } catch (err) {
    res.status(400).json({status: 'fail', message: err.message});
  }
};

export const createEmployee = async (req, res) => {
  try {
    await createEmployeeValidation.parseAsync(req.body);
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json({status: 'success', data: newEmployee});
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.username === 1) {
      res.status(409).json({status: 'fail', message: 'Username already exists'});
    } else {
      res.status(422).json({status: 'fail', message: err.errors || err.message});
    }
  }
};

export const updateEmployee = async (req, res) => {
  const id = req.params.id;
  try {
    if (id !== req.empId) return res.status(401).json({status: 'fail', message: 'Unauthorized'});
    await updateEmployeeValidation.parseAsync(req.body);
    const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, {new: true});
    res.status(200).json({status: 'success', data: updatedEmployee});
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.username === 1) {
      res.status(409).json({status: 'fail', message: 'Username already exists'});
    } else {
      res.status(422).json({status: 'fail', message: err.errors || err.message});
    }
  }
};

export const deleteEmployee = async (req, res) => {
  const id = req.params.id;
  try {
    if (id !== req.empId) return res.status(401).json({status: 'fail', message: 'Unauthorized'});
    await Leave.deleteMany({empId: id});
    await Employee.findByIdAndDelete(id);
    res.status(204).json({status: 'success', data: 'Employee Delete Successfully'});
  } catch (err) {
    res.status(400).json({status: 'fail', message: err.message});
  }
};

export const updateEmployeeProfile = async (req, res) => {
  const id = req.params.id;
  const profileData = req.body;
  try {
    if (id !== req.empId) return res.status(401).json({status: 'fail', message: 'Unauthorized'});
    await updateEmployeeProfileValidation.parseAsync(profileData);
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({status: 'fail', message: 'Employee not found'});

    if (employee.profile) {
      for (const key in profileData) {
        if (profileData[key] !== undefined) employee.profile[key] = profileData[key];
      }
    } else {
      const requiredData = ['title', 'description', 'department', 'phone', 'email'];
      const missingData = requiredData.filter((field) => !(field in profileData));

      if (missingData.length > 0) {
        return res.status(422).json({status: 'fail', message: `Missing required data: ${missingData.join(', ')}`});
      }
      employee.profile = profileData;
    }

    await employee.save();
    res.status(200).json({status: 'success', data: employee});
  } catch (err) {
    res.status(422).json({status: 'fail', message: err.errors || err.message});
  }
};
