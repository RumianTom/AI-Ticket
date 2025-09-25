import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Instantiate the Neon serverless client with the database connection URL.
 * The URL is securely retrieved from the environment variables.
 */
const sql = neon(process.env.DATABASE_URL!);

/**
 * Initialize Drizzle ORM with the Neon client and the defined schema.
 * The `schema` object is passed here to enable a type-safe query builder.
 * @type {DrizzlePostgreSQL}
 */
export const db = drizzle(sql, { schema });