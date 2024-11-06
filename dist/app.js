import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
export const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/auth', authRouter);
