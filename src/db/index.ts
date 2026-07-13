import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Lazily built so that importing this module during a build without a database
// (or in a preview with no env) does not throw. Callers that can run without
// data use `db()` and handle null; callers that cannot use `requireDb()`.
let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function db() {
  if (!process.env.DATABASE_URL) return null;
  if (!cached) {
    cached = drizzle(neon(process.env.DATABASE_URL), { schema });
  }
  return cached;
}

export function requireDb() {
  const client = db();
  if (!client) throw new Error("DATABASE_URL is not set on this deployment.");
  return client;
}

export * from "./schema";
