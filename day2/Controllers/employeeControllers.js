import fs from "fs";
import path from "path";
import {__dirname, FILE_PATH} from "../index.js";
import {validData} from "../Validation/validation.js";

export const getEmployees = (_, res) => {
  try {
    res.setHeader('Content-Type', 'text/html');
    res.write(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Employee List</title>
        <link rel="stylesheet" href="../public/styles.css">
      </head>
      <body>
        <h1>Employee List</h1>
        <div class="employee-container">
        <ul class="employee-list">`
    );

    getEmployeesData().forEach(emp => {
      res.write(`<li class="employee-card">`);
      Object.entries(emp).forEach(([k, v]) => {
        if (k === "id") return;
        k = k[0].toUpperCase() + k.slice(1);
        res.write(`<p>${k}: ${v}</p>`);
      });
      res.write(`</li>`);
    });
    res.end(`</ul></div></body></html>`);
  } catch (err) {
    res.writeHead(500, {"Content-Type": "application/json"});
    res.end(JSON.stringify({status: "fail", message: err.message}));
  }
};

export const insertEmployee = (req, res) => {
  let bodyData = '';
  req.on('data', chunk => {
    bodyData += chunk.toString();
  });

  req.on('end', () => {
    try {
      const employees = getEmployeesData();
      const empData = Object.fromEntries(new URLSearchParams(bodyData));
      const maxId = employees.length > 0 ? employees[employees.length - 1].id : 0;
      const objEmployee = {id: maxId + 1, level: 'Jr', yearsOfExperience: 0};

      Object.entries(empData).forEach(([k, v]) => {
        if (k.toLowerCase() === 'id') return;
        v = isNaN(v) ? v : +v;
        objEmployee[k] = v;
      });

      validData(objEmployee);
      employees.push(objEmployee);
      fs.writeFileSync(FILE_PATH, JSON.stringify(employees));
      console.log("Employee added successfully");
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
  });
};

export const pageWithImage = (req, res, data) => {
  res.setHeader('Content-Type', 'text/html');
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Page with Image</title>
      <link rel="stylesheet" href="../public/styles.css">
    </head>
    <body>
      <div class="content-container">
      <div class="image-box">
        <img src="../public/${data.image}" alt="">
      </div>
        <p class="description">${data.desc}</p>
      </div>
    </body>
    </html>
  `);
};

export const showImage = (req, res) => {
  try {
    const filePath = path.join(__dirname, req.url);
    const data = fs.readFileSync(filePath);
    if (req.url.endsWith(".css")) {
      res.writeHead(200, {"Content-Type": "text/css"});
      res.end(data);
    } else {
      res.writeHead(200, {"Content-Type": "image/jpeg"});
      res.end(data);
    }
  } catch (err) {
    res.writeHead(500, {"Content-Type": "application/json"});
    res.end(JSON.stringify({status: "fail", message: err.message}));
  }
};

export const pageNotFound = (req, res) => {
  res.writeHead(404, {"content-type": "text/html"});
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Page Not Found</title>
      <link rel="stylesheet" href="../public/styles.css">
    </head>
    <body>
      <div class="error-container">
        <h1 class="error-code">404</h1>
        <p class="error-message">Page Not Found</p>
        <a href="/" class="back-home">Back to Home</a>
      </div>
    </body>
    </html>
  `);
}

/************************************** Helper Functions **************************************/
const getEmployeesData = ()=> JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
