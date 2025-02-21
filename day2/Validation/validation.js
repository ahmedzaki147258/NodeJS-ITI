import validator from 'validator';

export function validData(data) {
  const {name, email, salary, level, yearsOfExperience} = data;
  if (!name || typeof name !== 'string') throw new Error('name must be string and required.');
  if (!email || !validator.isEmail(email)) throw new Error('E-mail must be valid email and required.');
  if (!salary || typeof salary !== 'number' || salary <= 0) throw new Error('Salary must be positive number and required.');
  if (!['Jr', 'Mid-Level', 'Sr', 'Lead'].includes(level)) throw new Error('Level must be Jr, Mid-Level, Sr or Lead.');
  if (typeof yearsOfExperience !== 'number' || yearsOfExperience < 0) throw new Error('YearsOfExperience must be positive number or 0.');
}
