import imageData from "./imageData.js";
import {getEmployees, insertEmployee, pageWithImage} from "./Controllers/employeeControllers.js";

export const getRoutes = {
  "/": (req, res) => {
    getEmployees(req, res);
  },
  "/astronomy": (req, res) => {
    pageWithImage(req, res, imageData.astronomy);
  },
  "/serbal": (req, res) => {
    pageWithImage(req, res, imageData.serbal);
  },
};

export const postRoutes = {
  "/employee": (req, res) => {
    insertEmployee(req, res);
  },
}
