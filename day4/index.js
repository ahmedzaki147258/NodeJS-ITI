import process from 'node:process';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import labRoute from './routes/index.js';

dotenv.config();
const corsOption = {origin: 'http://127.0.0.1:5500'};

const app = express();
app.use(express.json());
app.use(cors(corsOption));
app.use(express.static('public'));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Mongoose connection successfully established');
  } catch (err) {
    console.error(`Mongoose connection error:${err}`);
  }
};

app.use('/', labRoute);

app.listen(process.env.PORT, async () => {
  await connectDB();
  console.log(`Server running on http:127.0.0.1:${process.env.PORT}`);
});
