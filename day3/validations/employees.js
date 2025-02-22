import {check, validationResult} from 'express-validator';

export const validateCreate = [
  check('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string'),
  check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email must be a valid email'),
  check('salary').notEmpty().withMessage('Salary is required').isFloat({min: 0}).withMessage('Salary must be greater than 0'),
  check('level').optional().isIn(['Jr', 'Mid-Level', 'Sr', 'Lead']).withMessage('Level must be Jr, Mid-Level, Sr or Lead'),
  check('yearsOfExperience').optional().isInt({min: 0}).withMessage('Years of experience must be greater than 0'),
  check('id')
    .custom((_, {req}) => {
      if (req.body.id !== undefined) throw new Error('id must not be provided');
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    next();
  }
];

export const validateUpdate = [
  check('name').optional().isString().withMessage('Name must be a string'),
  check('email').optional().isEmail().withMessage('Email must be a valid email'),
  check('salary').optional().isFloat({min: 0}).withMessage('Salary must be greater than 0'),
  check('level').optional().isIn(['Jr', 'Mid-Level', 'Sr', 'Lead']).withMessage('Level must be Jr, Mid-Level, Sr or Lead'),
  check('yearsOfExperience').optional().isInt({min: 0}).withMessage('Years of experience must be greater than 0'),
  check('id')
    .custom((_, {req}) => {
      if (req.body.id !== undefined) throw new Error('id must not be provided');
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    next();
  }
];
