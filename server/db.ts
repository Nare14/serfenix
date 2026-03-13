import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const connectionString =
  process.env.DATABASE_PUBLIC_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_PUBLIC_URL or DATABASE_URL must be set.");
}

export const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000,
});

pool.on("connect", () => {
  console.log("Postgres connected");
});

pool.on("error", (err) => {
  console.error("Postgres pool error:", err);
});

export const db = drizzle(pool, { schema });
