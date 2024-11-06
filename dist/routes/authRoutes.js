import express from 'express';
import { createUser } from '../controllers/authController.js';
const authRouter = express.Router();
authRouter.post('/login', (req, res) => {
    // Handle login logic
    res.send('Login successful');
});
authRouter.post('/register', (req, res) => {
    createUser(req, res);
});
authRouter.post('/logout', (req, res) => {
    // Handle logout logic
    res.send('Logout successful');
});
export default authRouter;
