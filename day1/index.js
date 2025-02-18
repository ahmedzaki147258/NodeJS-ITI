import fs from "fs";
import dotenv from "dotenv";
import {editEmployee, insertEmployee, listEmployees, removeEmployee} from "./Controllers/employeeControllers.js";

dotenv.config();
if(!fs.existsSync(process.env.FILE_PATH)){
    fs.writeFileSync(process.env.FILE_PATH, JSON.stringify([]));
}

const args = process.argv.slice(2);
switch (args.shift()) {
    case "add":
        insertEmployee(args);
        break;
    case "list":
        listEmployees(args);
        break;
    case "edit":
        editEmployee(args);
        break;
    case "delete":
        removeEmployee(args);
        break;
    default:
        console.error("Invalid Operation");
}
