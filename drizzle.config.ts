import { defineConfig } from "drizzle-kit";
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL as string;
export default defineConfig({
  out: "./src/drizzle/migrations",
  dialect: "postgresql",
  schema: "./src/drizzle/schema.js",

  driver: "pglite",
  dbCredentials: {
    url: dbUrl,
  },

  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "*",

  introspect: {
    casing: "camel",
  },

  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "./src/drizzle/schema.ts",
  },

  entities: {
    roles: {
      provider: '',
      exclude: [],
      include: []
    }
  },

  breakpoints: true,
  strict: true,
  verbose: true,
});
