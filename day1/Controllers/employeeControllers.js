import fs from "fs";
import {checkEmployeeExist, validData} from "../Validation/validation.js";

export function insertEmployee(args){
  try {
    const employees = JSON.parse(fs.readFileSync(process.env.FILE_PATH, "utf-8"));
    const maxId = employees.length > 0 ? employees.at(-1).id : 0;
    const objEmployee = {id: maxId+1};
    for (let i = 0; i < args.length; i++) {
      let [k, v] = args[i].split("=");
      k = k.replace("--", "");
      v = isNaN(v) ? v : +v;
      if(k.toLowerCase() === 'id') continue;
      objEmployee[k] = v;
    }
    if(!objEmployee.level) objEmployee.level = 'Jr';
    if(!objEmployee.yearsOfExperience) objEmployee.yearsOfExperience = 0;

    validData(objEmployee);
    employees.push(objEmployee);
    fs.writeFileSync(process.env.FILE_PATH, JSON.stringify(employees));
  } catch (err) {
    console.error(err.message);
  }
}

export function editEmployee(args){
  try {
    checkEmployeeExist(args);
    const employees = JSON.parse(fs.readFileSync(process.env.FILE_PATH, "utf-8"));
    const employee = employees.find(({id})=>id===+args[0]);
    for (let i = 1; i < args.length; i++) {
      let [k, v] = args[i].split("=");
      k = k.replace("--", "");
      v = isNaN(v) ? v : +v;
      if(k.toLowerCase() === 'id') continue;
      employee[k] = v;
    }

    validData(employee);
    fs.writeFileSync(process.env.FILE_PATH, JSON.stringify(employees));
  } catch (err) {
    console.error(err.message);
  }
}

export function removeEmployee(args){
  try{
    checkEmployeeExist(args);
    let employees = JSON.parse(fs.readFileSync(process.env.FILE_PATH, "utf-8"));
    employees = employees.filter(emp=>emp.id!==+args[0]);
    fs.writeFileSync(process.env.FILE_PATH, JSON.stringify(employees));
  } catch (err) {
    console.error(err.message);
  }
}

export function listEmployees(args){
  try {
    const employee = checkEmployeeExist(args, false);
    const employees = JSON.parse(fs.readFileSync(process.env.FILE_PATH, "utf-8"));
    if (args.length>0) console.log(formatDataHelper(employee));
    else console.log(employees.map(emp => formatDataHelper(emp)).join("\n"));
  } catch (err) {
    console.error(err.message);
  }
}

/************************************** Helper Functions **************************************/
function formatDataHelper(data) {
  return Object.entries(data).map(([k, v]) => {
    k = k[0].toUpperCase() + k.slice(1);
    return `${k}: ${v}`
  }).join(", ")
}
