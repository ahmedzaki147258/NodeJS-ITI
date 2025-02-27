import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const profileSet = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Profile should have a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Profile should have a description'],
    trim: true
  },
  yearOfExperience: {
    type: Number,
    default: 0
  },
  department: {
    type: String,
    required: [true, 'Profile should have a department'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Profile should have a phone number'],
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Profile should have a email'],
    match: /^\S[^\s@]*@\S[^\s.]*\.\S+$/,
    trim: true
  }
});

const employeeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Employee should have a username'],
    unique: true,
    trim: true,
    minLength: [8, 'UserName should be at least 8 characters long'],
    validate: {
      validator: (val) => !/\s/.test(val),
      message: 'Username should not contain spaces'
    }
  },
  firstName: {
    type: String,
    required: [true, 'Employee should have a firstName'],
    minLength: [3, 'firstName should be at least 3 characters long'],
    maxLength: [15, 'firstName should be at most 15 characters long'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Employee should have a lastName'],
    minLength: [3, 'lastName should be at least 3 characters long'],
    maxLength: [15, 'lastName should be at most 15 characters long'],
    trim: true
  },
  dob: {
    type: Date,
    required: [true, 'Employee should have a dob']
  },
  password: {
    type: String,
    required: [true, 'Employee should have a password'],
    trim: true
  },
  profile: {
    type: profileSet,
    default: null
  }
}, {timestamps: true});

employeeSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  this.firstName = this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1).toLowerCase();
  this.lastName = this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1).toLowerCase();
  next();
});

employeeSchema.pre('findOneAndUpdate', async function (next) {
  const updatedData = this.getUpdate();
  if (updatedData.password) updatedData.password = await bcrypt.hash(updatedData.password, 10);
  if (updatedData.firstName) updatedData.firstName = updatedData.firstName.charAt(0).toUpperCase() + updatedData.firstName.slice(1).toLowerCase();
  if (updatedData.lastName) updatedData.lastName = updatedData.lastName.charAt(0).toUpperCase() + updatedData.lastName.slice(1).toLowerCase();
  this.setUpdate(updatedData);
  next();
});

const calculateAge = (dob) => new Date().getFullYear() - new Date(dob).getFullYear();
employeeSchema.set('toJSON', {
  transform: (doc, {_id, firstName, dob}) => ({id: _id, firstName, age: calculateAge(dob)})
});

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
