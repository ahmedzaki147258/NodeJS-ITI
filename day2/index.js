import fs from 'node:fs';
import http from 'node:http';
import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {pageNotFound, showImage} from './Controllers/employeeControllers.js';
import {getRoutes, postRoutes} from './routes.js';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const FILE_PATH = path.join(__dirname, 'employees.json');

if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify([]));
}

const server = http.createServer((req, res) => {
  const {url, method} = req;
  switch (method) {
    case 'GET':
      if (getRoutes[url]) getRoutes[url](req, res);
      else if (url.startsWith('/public/')) showImage(req, res);
      else pageNotFound(req, res);
      break;
    case 'POST':
      if (postRoutes[url]) postRoutes[url](req, res);
      else pageNotFound(req, res);
      break;
    default:
      pageNotFound(req, res);
  }
  res.end();
});

server.listen(3000, () => console.log('Server is running on http://localhost:3000'));
