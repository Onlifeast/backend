import express from 'express';
import {
  getUsers,
  getUserById,
  updateUserName,
  updateUserEmail,
  updatePassword,
  updateUserPhone,
  deleteUser
} from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/:id', (req: express.Request, res: express.Response) => {
  getUserById(req, res);
});

userRouter.get('/', (req: express.Request, res: express.Response) => {
  // returns all  users (to admin)
  getUsers(req, res);
});

userRouter.put('/update_name', (req: express.Request, res: express.Response) => {
  // users to update their details
  updateUserName(req, res);
}).put('/update_password', (req: express.Request, res: express.Response) => {
  // users to update their passwords
  updatePassword(req, res);
}).put('/update_email', (req: express.Request, res: express.Response) => {
  // users to update their emails
  updateUserEmail(req, res);
}).put('/update_phone', (req: express.Request, res: express.Response) => {
  // users to update their phone numbers
  updateUserPhone(req, res);
})

userRouter.delete('/', (req: express.Request, res: express.Response) => {
  // users to delete their accounts
  deleteUser(req, res);
});

export default userRouter;

