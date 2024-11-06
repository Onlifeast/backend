import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL as string;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const migrationClient = postgres(DATABASE_URL, { max: 1 });
const db = drizzle(migrationClient);

const main = async (): Promise<void> => {
  console.log("Migrating database...");
  await migrate(db, { migrationsFolder: "./src/drizzle/migrations" });
  await migrationClient.end();
  console.log("Database migrated successfully!");
};

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});