import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import "dotenv/config";
const connectionString = process.env.DATABASE_URL;
const pool = postgres(connectionString);
export const db = drizzle(pool);
