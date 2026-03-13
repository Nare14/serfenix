import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const connectionString =
  process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or DATABASE_PUBLIC_URL must be set.");
}

const isPublicUrl =
  connectionString.includes("railway.app") ||
  connectionString.includes("sslmode=require");

export const pool = new pg.Pool({
  connectionString,
  ssl: isPublicUrl ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});

pool.on("error", (err) => {
  console.error("Postgres pool error:", err);
});

export const db = drizzle(pool, { schema });
