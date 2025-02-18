import fs from "fs";
import validator from "validator";

export function validData (data) {
    const { name, email, salary, level, yearsOfExperience } = data;
    if (!name || typeof name !== "string") throw new Error("name must be string and required.");
    if (!email || !validator.isEmail(email)) throw new Error("E-mail must be valid email and required.");
    if (!salary || typeof salary !== "number" || salary <= 0) throw new Error("Salary must be positive number and required.");
    if (!["Jr", "Mid-Level", "Sr", "Lead"].includes(level)) throw new Error('Level must be "Jr", "Mid-Level", "Sr" or "Lead".');
    if (typeof yearsOfExperience !== "number" || yearsOfExperience < 0) throw new Error("YearsOfExperience must be positive number or 0.");
}

export function checkEmployeeExist(args, isRequired=true) {
    const id = args[0];
    if(isRequired && !id) throw new Error("Id is required.");
    else if(!isRequired && !id) return;
    if(isNaN(id)) throw new Error("Id must be number.");
    const employees = JSON.parse(fs.readFileSync(process.env.FILE_PATH, "utf-8"));
    const employee = employees.find(emp=>emp.id===+id);
    if(!employee) throw new Error(`Employee with id ${id} not found.`);
    return employee;
}
