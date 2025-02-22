import fs from 'node:fs';
import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import express from 'express';
import employeesRouter from './routes/employees.js';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export const FILE_PATH = path.join(__dirname, 'employees.json');

if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify([]));
}

const app = express();
app.set('view engine', 'pug');
app.set('views', 'views');
app.use(express.static('public'));
app.use(express.json());
app.use('/employees', employeesRouter);
app.get('/', (req, res) => {
  const employees = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
  res.render('index.pug', {employees});
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
