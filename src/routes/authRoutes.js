import express from 'express';


const authRouter = express.Router();

authRouter.post('/login', (req, res) => {
  // Handle login logic
  res.send('Login successful');
});

authRouter.post('/register', (req, res) => {
  // Handle registration logic
  res.send('Registration successful');
});

authRouter.post('/logout', (req, res) => {
  // Handle logout logic
  res.send('Logout successful');
});



export default authRouter;