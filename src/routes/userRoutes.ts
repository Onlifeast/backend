import express from 'express';
import { getUserById } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/:id', (req: express.Request, res: express.Response) => {
  getUserById(req, res);
});

