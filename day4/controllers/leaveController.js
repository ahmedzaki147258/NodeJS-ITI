import {createLeaveValidation, updateLeaveValidation} from '../middlewares/validations.js';
import Leave from '../models/leaveSchema.js';

export const createLeave = async (req, res) => {
  try {
    req.body.empId = req.empId;
    await createLeaveValidation.parseAsync(req.body);
    const newLeave = new Leave(req.body);
    await newLeave.save();
    res.status(201).json({status: 'success', data: newLeave});
  } catch (err) {
    res.status(422).json({status: 'fail', message: err.errors || err.message});
  }
};

export const updateLeave = async (req, res) => {
  const id = req.params.id;
  try {
    const leave = await Leave.findById(id);
    if (!leave) return res.status(404).json({status: 'fail', message: 'Leave not found'});
    if (leave.empId.toString() !== req.empId) return res.status(401).json({status: 'fail', message: 'Unauthorized'});
    if (req.body.status && leave.status !== 'inProgress' && req.body.status === 'inProgress') {
      return res.status(400).json({status: 'fail', message: 'Cannot update leave status once it is not in progress'});
    }
    await updateLeaveValidation.parseAsync(req.body);
    const updatedLeave = await Leave.findByIdAndUpdate(id, req.body, {new: true});
    res.status(200).json({status: 'success', data: updatedLeave});
  } catch (err) {
    res.status(422).json({status: 'fail', message: err.errors || err.message});
  }
};

export const getLeavesByEmployee = async (req, res) => {
  const empId = req.params.id;
  try {
    if (empId !== req.empId) return res.status(401).json({status: 'fail', message: 'Unauthorized'});
    const leaves = await Leave.find({empId});
    res.status(200).json({status: 'success', data: leaves});
  } catch (err) {
    res.status(500).json({status: 'fail', message: err.message});
  }
};

export const getAllLeaves = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.empId) filter.empId = req.query.empId;
  const skip = Number.parseInt(req.query.skip) || 0;
  const limit = Number.parseInt(req.query.limit) || 10;
  try {
    const leaves = await Leave.find(filter).skip(skip).limit(limit).populate('empId', 'username').lean(); // lean don't apply toJSON, return json object
    res.status(200).json({status: 'success', data: leaves});
  } catch (err) {
    res.status(500).json({status: 'fail', message: err.message});
  }
};
