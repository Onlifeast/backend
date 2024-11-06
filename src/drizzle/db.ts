import { drizzle } from 'drizzle-orm/postgres-js';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import "dotenv/config";

const connectionString = process.env.DATABASE_URL as string;
const pool = postgres(connectionString);
export const db: PostgresJsDatabase = drizzle(pool);