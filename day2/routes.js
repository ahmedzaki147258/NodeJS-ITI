import {getEmployees, insertEmployee, pageWithImage} from './Controllers/employeeControllers.js';
import imageData from './imageData.js';

export const getRoutes = {
  '/': (req, res) => {
    getEmployees(req, res);
  },
  '/astronomy': (req, res) => {
    pageWithImage(req, res, imageData.astronomy);
  },
  '/serbal': (req, res) => {
    pageWithImage(req, res, imageData.serbal);
  }
};

export const postRoutes = {
  '/employee': (req) => {
    insertEmployee(req);
  }
};
