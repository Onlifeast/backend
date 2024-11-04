import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/auth', authRouter);