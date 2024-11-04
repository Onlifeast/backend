import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import { db } from './drizzle/db.js';
import { UserTable } from './drizzle/schema.js';

export const app = express();

app.use(cors());
app.use(express.json());

// async function insertUser() {
//   try {
//     const result = await db.insert(UserTable).values({
//       name: "John Doe",
//       email: "johndoe@example.com",
//       password: "password123",
//     }).returning({
//       id: UserTable.id,
//       name: UserTable.name,
//       email: UserTable.email
//     });
    
//     console.log("Inserted user:", result);
//   } catch (error) {
//     console.error("Failed to insert user:", error);
//   }
// }


// insertUser();
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/auth', authRouter);