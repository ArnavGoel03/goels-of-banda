import { defineConfig } from "drizzle-kit";

// The public site's database. It holds only what the family submits and what an
// admin publishes. It is deliberately NOT the Kin database: Kin holds passports,
// Aadhaar scans and medical records, and a public website's credentials must
// never be able to read those.
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  strict: true,
  verbose: true,
});
