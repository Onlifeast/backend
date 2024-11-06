import express, { Request, Response } from 'express';
import { createUser, loginUser } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/login', (req: Request, res: Response) => {
  loginUser(req, res);
});

authRouter.post('/register', (req: Request, res: Response) => {
  createUser(req, res);
});

authRouter.post('/logout', (req: Request, res: Response) => {
  // Handle logout logic
  res.send('Logout successful');
});

export default authRouter;
