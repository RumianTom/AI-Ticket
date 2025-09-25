import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit Configuration.
 *
 * This file configures the Drizzle Kit CLI, which is used to manage database migrations.
 * It specifies the database dialect, the location of the schema file, and the directory
 * where migration files will be stored.
 *
 * This configuration ensures that our schema is the single source of truth and that all
 * database changes are version-controlled, which is a key part of our "Codebase First"
 * strategy.
 */
export default defineConfig({
  // The database dialect is set to 'postgresql' to match our Neon database.
  dialect: "postgresql",

  // This points to the TypeScript file where our database schema is defined.
  schema: "./src/db/schema.ts",

  // This defines the output directory for generated migration files.
  out: "./migrations",

  // dbCredentials uses the DATABASE_URL environment variable to connect
  // to the Neon database. This ensures our credentials remain secure.
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});